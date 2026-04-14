/**
 * sessionStore.js
 *
 * In-memory session store for the WhatsApp bot.
 *
 * Each session is keyed by the customer's WhatsApp phone number and holds:
 *   - state   : current step in the conversation flow
 *   - cart    : selected services / options accumulated so far
 *   - info    : booking details collected (date, time, address, name, phone)
 *   - orderId : MongoDB Order._id once the order is created
 *
 * Sessions expire after SESSION_TTL_MS of inactivity (default 30 minutes).
 *
 * If a Redis client is provided via `initRedis(client)` the store will
 * delegate to Redis automatically, making horizontal scaling trivial.
 * When Redis is not configured the store falls back to a plain JS Map.
 */

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ── In-memory fallback ────────────────────────────────────────────────────────
const memStore = new Map(); // phone → { data, expiresAt }

// Periodic cleanup of expired in-memory sessions
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memStore) {
    if (entry.expiresAt < now) memStore.delete(key);
  }
}, CLEANUP_INTERVAL_MS);

// ── Optional Redis client ─────────────────────────────────────────────────────
let redisClient = null;

/**
 * Optionally wire up a ioredis / node-redis client so sessions survive
 * server restarts and work across multiple instances.
 *
 * @param {object} client - An ioredis-compatible client
 */
export function initRedis(client) {
  redisClient = client;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Retrieve a session. Returns a plain object or null.
 * @param {string} phone - E.164 phone number used as key
 */
export async function getSession(phone) {
  const key = `wa:session:${phone}`;
  if (redisClient) {
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  }
  const entry = memStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    memStore.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Save (create or overwrite) a session.
 * @param {string} phone
 * @param {object} data - Arbitrary session payload
 */
export async function setSession(phone, data) {
  const key = `wa:session:${phone}`;
  if (redisClient) {
    await redisClient.set(key, JSON.stringify(data), 'PX', SESSION_TTL_MS);
    return;
  }
  memStore.set(key, { data, expiresAt: Date.now() + SESSION_TTL_MS });
}

/**
 * Delete a session (e.g. after order confirmed or user cancels).
 * @param {string} phone
 */
export async function deleteSession(phone) {
  const key = `wa:session:${phone}`;
  if (redisClient) {
    await redisClient.del(key);
    return;
  }
  memStore.delete(key);
}

/**
 * Create a fresh, empty session object.
 */
export function newSession() {
  return {
    state: 'MAIN_MENU',
    cart: {
      category: null,       // top-level category (e.g. 'car_wash')
      packageName: null,
      packagePrice: 0,
      vehicleType: null,
      subCategory: null,
      quantity: 1,
      extras: [],           // [{name, price, qty}]
    },
    info: {
      date: null,
      timeSlot: null,
      address: null,
      name: null,
      phone: null,
    },
    orderId: null,
    razorpayOrderId: null,
    lastActivity: Date.now(),
  };
}
