/**
 * whatsappController.js
 *
 * Handles incoming WhatsApp webhook events from Twilio (or WATI).
 * Manages session lifecycle, delegates to the bot state machine,
 * creates orders in MongoDB, and dispatches Razorpay payment links.
 */

import Razorpay from 'razorpay';
import twilio from 'twilio';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { getSession, setSession, newSession } from '../services/sessionStore.js';
import {
  processMessage,
  buildOrderPayload,
  MESSAGES,
} from '../services/whatsappBot.js';
import { broadcastToAdmins, formatOrderMessage } from '../services/telegramService.js';

// Sanitise a phone string to a safe E.164-like value (+digits only)
const sanitizePhone = (raw) => String(raw || '').replace(/[^\d+]/g, '').slice(0, 15);

// Validate a Razorpay payment ID format (e.g. pay_XXXXXXXXXXXXXXXXXX)
const isValidRazorpayId = (id) => /^pay_[A-Za-z0-9]{14,25}$/.test(String(id || ''));

// ── Twilio client (lazy-init so missing env vars don't crash on startup) ──────
let twilioClient = null;
function getTwilioClient() {
  if (!twilioClient) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      console.warn('[whatsapp] TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set – messaging disabled');
      return null;
    }
    twilioClient = twilio(sid, token);
  }
  return twilioClient;
}

// ── Razorpay client ────────────────────────────────────────────────────────────
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Send a WhatsApp message via Twilio.
 * Silently skips if Twilio is not configured (development mode).
 */
async function sendWhatsAppMessage(to, body) {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[whatsapp][DEV] → ${to}: ${body}`);
    return;
  }
  const from = `whatsapp:${process.env.WHATSAPP_NUMBER || '+14155238886'}`;
  try {
    await client.messages.create({ from, to: `whatsapp:${to}`, body });
  } catch (err) {
    console.error('[whatsapp] Failed to send message:', err.message);
  }
}

/**
 * Find or create a minimal "WhatsApp user" in MongoDB so we can associate an
 * Order with a userId (required by the Order schema).
 */
async function findOrCreateWhatsAppUser(phone, name) {
  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({
      name: name || 'WhatsApp Customer',
      phone,
      provider: 'local',
      status: 'active',
    });
    await user.save();
  } else if (name && user.name === 'WhatsApp Customer') {
    user.name = name;
    await user.save();
  }
  return user;
}

/**
 * Create a Razorpay payment link for the given amount and order ID.
 * Returns the short_url or a fallback message if Razorpay is not configured.
 */
async function createRazorpayPaymentLink(amountInRupees, orderId, customerPhone, customerName) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return `https://pay.bubbleflash.in/order/${orderId}`;
  }
  try {
    const rp = getRazorpay();
    const link = await rp.paymentLink.create({
      amount: Math.round(amountInRupees * 100), // paise
      currency: 'INR',
      description: 'Bubble Flash Services Booking',
      customer: {
        name: customerName || 'Customer',
        contact: customerPhone,
      },
      notify: { sms: false, email: false },
      reminder_enable: true,
      notes: { orderId: String(orderId) },
      callback_url: `${process.env.BACKEND_URL || 'https://bubbleflash.in'}/api/whatsapp/payment-callback`,
      callback_method: 'get',
    });
    return link.short_url;
  } catch (err) {
    console.error('[whatsapp] Razorpay payment link error:', err.message);
    return `https://pay.bubbleflash.in/order/${orderId}`;
  }
}

// ── Controller: Twilio webhook ─────────────────────────────────────────────────

/**
 * POST /api/whatsapp/webhook
 *
 * Twilio sends an application/x-www-form-urlencoded body with (among others):
 *   From  : whatsapp:+919876543210
 *   Body  : customer message text
 *
 * WATI webhooks send JSON:
 *   { waId, text: { body }, ... }
 *
 * We handle both.
 */
export async function handleWebhook(req, res) {
  // Acknowledge immediately so Twilio/WATI doesn't retry
  res.status(200).send('OK');

  try {
    let phone, text;

    // ── Twilio format ────────────────────────────────────────────────────────
    if (req.body.From && req.body.Body) {
      phone = req.body.From.replace('whatsapp:', '').trim();
      text = (req.body.Body || '').trim();
    }
    // ── WATI JSON format ─────────────────────────────────────────────────────
    else if (req.body.waId || req.body.phone) {
      phone = (req.body.waId || req.body.phone || '').trim();
      // WATI can deliver either text or location
      text = (
        (req.body.text && req.body.text.body) ||
        req.body.message ||
        ''
      ).trim();

      // Location pin shared by customer
      if (req.body.type === 'location' && req.body.location) {
        const { address, name, latitude, longitude } = req.body.location;
        text = address || name || `${latitude},${longitude}`;
      }
    } else {
      // Unsupported payload shape – ignore
      return;
    }

    if (!phone || !text) return;

    // Normalise to E.164 (+91XXXXXXXXXX)
    if (!phone.startsWith('+')) phone = `+${phone}`;
    phone = sanitizePhone(phone);

    await handleIncoming(phone, text);
  } catch (err) {
    console.error('[whatsapp] Webhook error:', err);
  }
}

/**
 * Core message processing pipeline.
 */
async function handleIncoming(phone, text) {
  // Load or create session
  let session = await getSession(phone);
  if (!session) session = newSession();

  // Run through the state machine
  const result = processMessage(session, text);
  session.state = result.nextState;
  session.lastActivity = Date.now();

  // ── Special states that need controller-side I/O ───────────────────────────

  if (result.nextState === 'STATUS_LOOKUP') {
    await handleStatusLookup(phone, session);
    return;
  }

  if (result.orderReady || result.nextState === 'CREATE_ORDER') {
    await handleCreateOrder(phone, session);
    return;
  }

  if (result.nextState === 'SEND_PAY_LINK') {
    await handleSendPayLink(phone, session);
    return;
  }

  // ── Normal reply ──────────────────────────────────────────────────────────
  if (result.reply) {
    await sendWhatsAppMessage(phone, result.reply);
  }

  await setSession(phone, session);
}

// ── Order creation flow ────────────────────────────────────────────────────────

async function handleCreateOrder(phone, session) {
  try {
    const { info, cart } = session;

    // Find or create user
    const user = await findOrCreateWhatsAppUser(info.phone || phone, info.name);

    // Build and save order
    const payload = buildOrderPayload(session, user._id, 'cash');

    // WhatsApp orders don't reference a Service document.
    // Assign a fresh ObjectId as a placeholder so the required schema field
    // is satisfied; the category/serviceName fields carry the real details.
    payload.items = payload.items.map((item) => {
      const { serviceId, ...rest } = item;   // eslint-disable-line no-unused-vars
      return { ...rest, serviceId: new mongoose.Types.ObjectId() };
    });

    const order = new Order(payload);
    await order.save();

    session.orderId = order._id.toString();
    session.orderNumber = order.orderNumber;

    // Notify Telegram admins
    try {
      const msg = formatOrderMessage(order, { name: info.name, phone: info.phone });
      await broadcastToAdmins(`📱 WhatsApp Booking\n\n${msg}`);
    } catch (tgErr) {
      console.error('[whatsapp] Telegram notify error:', tgErr.message);
    }

    // Ask payment preference
    const extrasTotal = (cart.extras || []).reduce((s, e) => s + e.price * e.qty, 0);
    const total = cart.packagePrice + extrasTotal;

    // Store pay link slot (will be filled on demand when user picks option 1)
    session.pendingTotal = total;
    session.state = 'PAYMENT_CHOICE';

    const payLinkPlaceholder = `https://pay.bubbleflash.in/order/${order._id}`;
    await sendWhatsAppMessage(phone, MESSAGES.PAYMENT_OPTIONS(total, payLinkPlaceholder));
    await setSession(phone, session);
  } catch (err) {
    console.error('[whatsapp] Order creation error:', err);
    await sendWhatsAppMessage(
      phone,
      `⚠️ Sorry, we couldn't place your order right now. Please call us at *+91 95915 72775* or try again.\n\nReply *MENU* to restart.`
    );
  }
}

async function handleSendPayLink(phone, session) {
  try {
    const total = session.pendingTotal || session.cart.packagePrice || 0;
    const payLink = await createRazorpayPaymentLink(
      total,
      session.orderId,
      session.info.phone || phone,
      session.info.name
    );

    session.razorpayPayLink = payLink;
    session.state = 'AWAITING_PAYMENT';

    await sendWhatsAppMessage(
      phone,
      `💳 *Pay Securely Online*\n\n🔗 ${payLink}\n\nOnce payment is done your booking will be confirmed automatically.\n\nReply *STATUS* to check booking status.`
    );
    await setSession(phone, session);
  } catch (err) {
    console.error('[whatsapp] Payment link error:', err);
    await sendWhatsAppMessage(
      phone,
      `⚠️ Couldn't generate payment link. Please call *+91 95915 72775* to complete payment.\n\nReply *MENU* to restart.`
    );
  }
}

async function handleStatusLookup(phone, session) {
  try {
    // Sanitise phone values before using them in DB queries
    const safePhone = sanitizePhone(phone);
    const safeInfoPhone = sanitizePhone(session.info?.phone);

    let order;
    if (session.orderId && mongoose.Types.ObjectId.isValid(session.orderId)) {
      order = await Order.findById(session.orderId);
    } else {
      // Build an $or query so each phone value is an independent equality check,
      // avoiding any operator-injection risk from the $in array.
      const phoneClauses = [safePhone, safeInfoPhone]
        .filter(Boolean)
        .map((p) => ({ 'serviceAddress.phone': p }));
      if (phoneClauses.length === 0) {
        return await sendWhatsAppMessage(phone, MESSAGES.STATUS_NO_ORDER());
      }
      order = await Order.findOne({ $or: phoneClauses })
        .sort({ createdAt: -1 })
        .limit(1);
    }

    if (!order) {
      await sendWhatsAppMessage(phone, MESSAGES.STATUS_NO_ORDER());
    } else {
      const statusMap = {
        pending: 'Pending confirmation ⏳',
        confirmed: 'Confirmed ✅',
        assigned: 'Team assigned 👷',
        in_progress: 'Service in progress 🔧',
        completed: 'Completed 🎉',
        cancelled: 'Cancelled ❌',
      };
      const payMap = {
        pending: 'Pending',
        processing: 'Processing',
        completed: 'Paid ✅',
        failed: 'Failed ❌',
        refunded: 'Refunded',
      };
      const reply =
        `📋 *Order Status*\n\n` +
        `Order ID: #${order.orderNumber}\n` +
        `Service: ${order.items?.[0]?.serviceName || 'N/A'}\n` +
        `📅 ${order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString('en-IN') : 'N/A'}\n` +
        `⏰ ${order.scheduledTimeSlot || 'N/A'}\n` +
        `Status: ${statusMap[order.orderStatus] || order.orderStatus}\n` +
        `Payment: ${payMap[order.paymentStatus] || order.paymentStatus}\n\n` +
        `Reply *MENU* to place a new booking.`;

      await sendWhatsAppMessage(phone, reply);
    }

    session.state = 'MAIN_MENU';
    await setSession(phone, session);
  } catch (err) {
    console.error('[whatsapp] Status lookup error:', err);
    await sendWhatsAppMessage(phone, MESSAGES.STATUS_NO_ORDER());
  }
}

// ── Razorpay payment-callback (GET redirect after online payment) ───────────────

/**
 * GET /api/whatsapp/payment-callback?razorpay_payment_link_status=paid&...
 *
 * Razorpay redirects the customer here after payment.
 * We update the order status and send a confirmation WhatsApp message.
 */
export async function handlePaymentCallback(req, res) {
  const {
    razorpay_payment_link_id,
    razorpay_payment_id,
    razorpay_payment_link_status,
    razorpay_payment_link_reference_id,
  } = req.query;

  if (razorpay_payment_link_status === 'paid' && isValidRazorpayId(razorpay_payment_id)) {
    // Use a validated, strictly-typed payment ID to prevent injection
    const safePaymentId = String(razorpay_payment_id);
    try {
      // razorpay_payment_link_reference_id carries the notes.orderId we set when
      // creating the payment link. Fall back to razorpay_payment_link_id for legacy.
      const notesOrderId = razorpay_payment_link_reference_id || null;

      let order = null;
      if (notesOrderId && mongoose.Types.ObjectId.isValid(notesOrderId)) {
        order = await Order.findByIdAndUpdate(
          notesOrderId,
          {
            paymentStatus: 'completed',
            orderStatus: 'confirmed',
            razorpayPaymentId: safePaymentId,
            paidAt: new Date(),
          },
          { new: true }
        );
      }

      // Fallback: find by Razorpay payment ID in case the order was already
      // partially updated by the server-to-server webhook
      if (!order) {
        order = await Order.findOneAndUpdate(
          { razorpayPaymentId: safePaymentId },
          { paymentStatus: 'completed', orderStatus: 'confirmed', paidAt: new Date() },
          { new: true }
        );
      }

      if (order) {
        // Notify the customer via WhatsApp
        const customerPhone = order.serviceAddress?.phone;
        if (customerPhone) {
          const sessionData = await getSession(customerPhone);
          if (sessionData) {
            await sendWhatsAppMessage(
              customerPhone,
              MESSAGES.ORDER_CONFIRMED(order.orderNumber, sessionData)
            );
          } else {
            await sendWhatsAppMessage(
              customerPhone,
              `🎉 *Payment Successful!*\n\nOrder #${order.orderNumber} is confirmed.\n📅 ${order.scheduledTimeSlot}\n📍 ${order.serviceAddress.fullAddress}\n\n📞 Need help? Call +91 95915 72775`
            );
          }
        }
      }
    } catch (err) {
      console.error('[whatsapp] Payment callback error:', err);
    }
  }

  // Redirect customer to the website
  res.redirect(`${process.env.WEB_URL || 'https://bubbleflash.in'}/orders`);
}

// ── Razorpay webhook for server-to-server payment events ──────────────────────

/**
 * POST /api/whatsapp/razorpay-webhook
 *
 * Razorpay server-side webhook for payment_link.paid events.
 * Verifies signature and updates the order.
 */
export async function handleRazorpayWebhookWA(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret && signature) {
    const crypto = await import('crypto');
    const expected = crypto.default
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  }

  res.status(200).json({ success: true });

  try {
    const event = req.body.event;
    if (event !== 'payment_link.paid') return;

    const notes = req.body.payload?.payment_link?.entity?.notes || {};
    const orderId = notes.orderId;
    // Validate orderId before using it in a DB query to prevent injection
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) return;

    const razorpayPaymentId = req.body.payload?.payment?.entity?.id;
    // Only persist a payment ID that matches Razorpay's known format
    const safeRazorpayPaymentId = isValidRazorpayId(razorpayPaymentId)
      ? String(razorpayPaymentId)
      : undefined;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      ...(safeRazorpayPaymentId && { razorpayPaymentId: safeRazorpayPaymentId }),
      paidAt: new Date(),
    });
  } catch (err) {
    console.error('[whatsapp] Razorpay webhook error:', err);
  }
}
