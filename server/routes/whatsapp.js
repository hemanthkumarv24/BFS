/**
 * whatsapp.js  (route)
 *
 * Mounts all WhatsApp bot endpoints:
 *
 *   POST /api/whatsapp/webhook            — Twilio / WATI inbound message webhook
 *   GET  /api/whatsapp/payment-callback   — Razorpay redirect after payment
 *   POST /api/whatsapp/razorpay-webhook   — Razorpay server-side payment event
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  handleWebhook,
  handlePaymentCallback,
  handleRazorpayWebhookWA,
} from '../controllers/whatsappController.js';

const router = express.Router();

// Allow up to 120 messages/minute per IP on the inbound webhook (generous
// enough for legitimate Twilio/WATI traffic, blocks simple flood attacks).
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Razorpay webhooks come from a small set of Razorpay IPs; a tighter limit
// protects the DB without affecting normal operation.
const razorpayLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Inbound WhatsApp message (Twilio sends application/x-www-form-urlencoded;
// WATI sends JSON — both are parsed by the global body-parser middleware in app.js)
router.post('/webhook', webhookLimiter, handleWebhook);

// Customer redirect after Razorpay payment link is paid
// Rate-limited to prevent abuse (e.g., scanning for valid payment IDs)
router.get('/payment-callback', razorpayLimiter, handlePaymentCallback);

// Server-to-server Razorpay event webhook (raw body needed for signature check)
router.post('/razorpay-webhook', razorpayLimiter, handleRazorpayWebhookWA);

export default router;
