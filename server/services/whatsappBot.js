/**
 * whatsappBot.js
 *
 * Full state-machine and message-template engine for the Bubble Flash Services
 * WhatsApp bot.
 *
 * Each exported function receives the current session and the customer's reply,
 * mutates the session in place, and returns { reply, nextState }.
 *
 * Callers (whatsappController.js) are responsible for persisting the session
 * via sessionStore and sending the reply via the messaging provider.
 */

// ─── Time slots ──────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  '7:00 AM – 9:00 AM',
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
];

// ─── Service catalogues ───────────────────────────────────────────────────────
const CAR_PACKAGES = [
  { name: 'Quick Car Wash', price: 199, desc: 'Exterior rinse, basic wipe-down' },
  { name: 'Essential Interior & Exterior', price: 299, desc: 'Interior vacuum + exterior wash' },
  { name: 'Premium Car Wash', price: 699, desc: 'Full detailing, tire dressing, dashboard polish' },
];

const CAR_VEHICLE_TYPES = ['Hatchback', 'Sedan', 'SUV', 'Luxury'];

const BIKE_PACKAGES = [
  { name: 'Quick Bike Wash', price: 99 },
  { name: 'Essential Bike Care', price: 149 },
  { name: 'Premium Bike Detailing', price: 349 },
];

const BIKE_TYPES = ['Commuter', 'Sports', 'Cruiser'];

const LAUNDRY_PACKAGES = [
  { name: 'Dry Cleaning', price: 79, unit: '/item' },
  { name: 'Wash & Fold', price: 199, unit: ' (up to 5 kg)' },
  { name: 'Ironing & Pressing', price: 10, unit: '/item (min ₹599 order)' },
  { name: 'Folding Only', price: 5, unit: '/item' },
];

const HOME_INSTANT_CATEGORIES = [
  'Home Care',
  'Kitchen Care',
  'Bathroom Care',
  'Laundry Care',
  'Common Area',
  '🎁 Combo Packs',
];

const HOME_CARE_SERVICES = [
  { name: 'Sweeping & Mopping', price: 149 },
  { name: 'Dusting', price: 129 },
  { name: 'Window Cleaning', price: 79, unit: '/window' },
  { name: 'Fan Cleaning', price: 49, unit: '/fan' },
  { name: 'Balcony Cleaning', price: 79 },
  { name: 'Garbage Disposal', price: 19 },
];

const KITCHEN_SERVICES = [
  { name: 'Kitchen Quick Clean', price: 149 },
  { name: 'Utensils Washing', price: 99 },
  { name: 'Kitchen Prep', price: 149 },
];

const BATHROOM_INSTANT_SERVICES = [
  { name: 'Bathroom Quick Clean', price: 99 },
  { name: 'Shower Cubicle Quick Clean', price: 149 },
  { name: 'Bathtub Cleaning', price: 199 },
];

const LAUNDRY_INSTANT_SERVICES = [
  { name: 'Laundry', price: 60, unit: '/item' },
  { name: 'Ironing', price: 10, unit: '/item' },
  { name: 'Folding', price: 5, unit: '/item' },
];

const COMMON_AREA_SERVICES = [
  { name: 'Staircase Cleaning', price: 99 },
];

const COMBO_PACKS = [
  { name: 'Express Home Refresh', price: 249, desc: 'Sweeping + Mopping + Dusting' },
  { name: 'Kitchen & Bathroom Sparkle', price: 299, desc: 'Kitchen + Bathroom deep combo' },
  { name: 'Balcony & Outdoor Shine', price: 149, desc: 'Balcony + Staircase' },
  { name: 'Laundry Care Combo', price: 99, desc: 'Wash + Fold + Ironing bundle' },
  { name: 'Bedroom Refresh', price: 199, desc: 'Dusting + Fan Cleaning + Vacuuming' },
  { name: 'Complete Home MINI Clean', price: 399, desc: 'Sweep + Mop + Dust + Kitchen + Bathroom' },
];

const HOME_DEEP_CLEANING = {
  unfurnished: [
    { bhk: '1 BHK', price: 2799 },
    { bhk: '2 BHK', price: 3999 },
    { bhk: '3 BHK', price: 4999 },
    { bhk: '4 BHK', price: 6499 },
  ],
  furnished: [
    { bhk: '1 BHK', price: 3299 },
    { bhk: '2 BHK', price: 4899 },
    { bhk: '3 BHK', price: 5999 },
    { bhk: '4 BHK', price: 7499 },
  ],
};

const BATHROOM_DEEP_PACKAGES = [
  { name: 'Basic (1 bathroom)', price: 349 },
  { name: 'Standard (1 bathroom, full deep clean)', price: 499 },
  { name: 'Premium (1 bathroom)', price: 599 },
  { name: '2-Bathroom Package', price: 899 },
  { name: '3-Bathroom Package', price: 1299 },
  { name: '4-Bathroom Package', price: 1699 },
];

const COMMERCIAL_SERVICES = [
  { name: 'Office Deep Clean', price: 2999 },
  { name: 'Retail Store Cleaning', price: 2299 },
  { name: 'Factory Floor Cleaning', price: 3999 },
  { name: 'Warehouse Cleaning', price: 2999 },
  { name: 'Room Turnover (Hotel)', price: 799, unit: '/room' },
  { name: 'Banquet Hall Cleaning', price: 1999 },
  { name: 'Classroom Deep Cleaning', price: 999 },
  { name: 'Laboratory Cleaning', price: 1199 },
  { name: 'Auditorium Cleaning', price: 1499 },
];

const KEY_LOCK_SERVICES = [
  { name: 'House/Door Key Duplication', price: 99 },
  { name: 'Bike Key (Non-Digital) Duplication', price: 149 },
  { name: 'Emergency Lock Opening', price: 499, note: '24/7 available, 30-min response. Night rate ₹799' },
  { name: 'Car Remote Key Programming', price: 1499, note: 'Covers all car brands' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (price) => `₹${price.toLocaleString('en-IN')}`;
const num = (s) => parseInt(String(s).trim(), 10);
const normalize = (s) => String(s || '').trim().toLowerCase();

function buildList(items, startIdx = 1) {
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  return items
    .map((item, i) => {
      const e = emojis[startIdx - 1 + i] || `${startIdx + i}.`;
      const price = item.price !== undefined ? ` — ${fmt(item.price)}${item.unit || ''}` : '';
      const desc = item.desc ? `\n    ${item.desc}` : '';
      const note = item.note ? `\n    ℹ️ ${item.note}` : '';
      const label = item.bhk || item.name;
      return `${e}  ${label}${price}${desc}${note}`;
    })
    .join('\n');
}

// ─── Message Templates ────────────────────────────────────────────────────────

export const MESSAGES = {
  MAIN_MENU: () =>
    `👋 Welcome to *Bubble Flash Services* 🫧⚡

We bring professional cleaning services to your doorstep in Bengaluru!

Please choose a service:

1️⃣  🚗 Car Wash
2️⃣  🏍️ Bike Wash
3️⃣  👕 Laundry Services
4️⃣  🏠 Home Cleaning (Instant)
5️⃣  🏠 Home Deep Cleaning
6️⃣  🛁 Bathroom Deep Cleaning
7️⃣  🏢 Commercial / Industrial Cleaning
8️⃣  🔑 Key & Lock Services
9️⃣  🛒 Vehicle Accessories
🔟  🚗 Vehicle Checkup / Auto Fix
0️⃣  💬 Talk to a Human Agent

Reply with the number of your choice.`,

  CAR_PACKAGE: () =>
    `🚗 *Car Wash Services*

Choose your package:
${buildList(CAR_PACKAGES)}

📅 Monthly Plan saves ₹30–₹100! Reply *M1*, *M2*, or *M3* to see monthly pricing.`,

  CAR_MONTHLY: (pkg) =>
    `📅 *${pkg.name} — Monthly Plan*

Pay once a month and save!
• Basic (4 washes/month): ${fmt(pkg.price - 30)}/month
• Standard (8 washes/month): ${fmt(pkg.price * 2 - 70)}/month

Reply with *1*, *2*, or *3* to book a single wash, or *MENU* to restart.`,

  CAR_VEHICLE: () =>
    `🚘 Select your vehicle type:
${buildList(CAR_VEHICLE_TYPES.map((v) => ({ name: v })))}`,

  BIKE_PACKAGE: () =>
    `🏍️ *Bike Wash Services*

${buildList(BIKE_PACKAGES)}`,

  BIKE_TYPE: () =>
    `🏍️ Select your bike type:
${buildList(BIKE_TYPES.map((v) => ({ name: v })))}`,

  LAUNDRY_PACKAGE: () =>
    `👕 *Laundry Services*

${buildList(LAUNDRY_PACKAGES)}

After selecting, tell us the quantity (e.g., "3 items" or "5 kg").`,

  LAUNDRY_QUANTITY: (pkg) =>
    `You selected *${pkg.name}* (${fmt(pkg.price)}${pkg.unit || ''}).

How many items / kg would you like? Please type a number (e.g., *5*).`,

  HOME_INSTANT_CAT: () =>
    `🏠 *Instant Home Services*

Pick a category:
1️⃣  Home Care
2️⃣  Kitchen Care
3️⃣  Bathroom Care
4️⃣  Laundry Care
5️⃣  Common Area
6️⃣  🎁 Combo Packs (Best Value!)
0️⃣  ← Back to Main Menu`,

  HOME_CARE: () =>
    `🏠 *Home Care Services*

${buildList(HOME_CARE_SERVICES)}

➕ You can add multiple (e.g., *1,3,5*). For window/fan cleaning please also tell us the quantity.`,

  KITCHEN_CARE: () =>
    `🍳 *Kitchen Care*

${buildList(KITCHEN_SERVICES)}`,

  BATHROOM_INSTANT: () =>
    `🚿 *Bathroom Care*

${buildList(BATHROOM_INSTANT_SERVICES)}`,

  LAUNDRY_INSTANT: () =>
    `👕 *Laundry (per item)*

${buildList(LAUNDRY_INSTANT_SERVICES)}

Please also specify quantities, e.g., *"Laundry 5, Ironing 3"*.`,

  COMMON_AREA: () =>
    `🏢 *Common Area*

${buildList(COMMON_AREA_SERVICES)}`,

  COMBO_PACKS: () =>
    `🎁 *Best Value Combo Packs*

${buildList(COMBO_PACKS)}`,

  HOME_DEEP_FURNISH: () =>
    `🏠 *Home Deep Cleaning*

Select furnishing type:
1️⃣  Unfurnished
2️⃣  Fully Furnished`,

  HOME_DEEP_SIZE: (furnishType) => {
    const list = HOME_DEEP_CLEANING[furnishType];
    return `Select home size (${furnishType === 'unfurnished' ? 'Unfurnished' : 'Fully Furnished'}):

${buildList(list)}`;
  },

  BATHROOM_DEEP: () =>
    `🛁 *Bathroom Deep Cleaning*

${buildList(BATHROOM_DEEP_PACKAGES)}`,

  COMMERCIAL: () =>
    `🏢 *Commercial & Industrial Cleaning*

${buildList(COMMERCIAL_SERVICES)}

📞 Large orders? Reply *QUOTE* for a custom quote.`,

  KEY_LOCK: () =>
    `🔑 *Key & Lock Services*

${buildList(KEY_LOCK_SERVICES)}`,

  ACCESSORIES_REDIRECT: () =>
    `🛒 *Vehicle Accessories*

Browse our full accessories catalogue on the website:
🌐 https://bubbleflash.in/vehicle-accessories

Or reply *MENU* to explore other services.`,

  CHECKUP_REDIRECT: () =>
    `🚗 *Vehicle Checkup / Auto Fix*

Book a full vehicle checkup on the website:
🌐 https://bubbleflash.in/vehicle-checkup

Or reply *MENU* to explore other services.`,

  HUMAN_AGENT: () =>
    `💬 Connecting you to a human agent…

📞 You can also call us directly: *+91 95915 72775*
⏰ Available 8 AM – 8 PM, 7 days a week.

Reply *MENU* to go back to the main menu.`,

  ASK_DATE: () =>
    `✅ Great choice! Let's complete your booking.

📅 What date would you like the service?
(Reply in *DD/MM/YYYY* format, e.g., *20/04/2025*)`,

  ASK_TIME: () =>
    `⏰ Preferred time slot:
1️⃣  7:00 AM – 9:00 AM
2️⃣  9:00 AM – 11:00 AM
3️⃣  11:00 AM – 1:00 PM
4️⃣  2:00 PM – 4:00 PM
5️⃣  4:00 PM – 6:00 PM
6️⃣  6:00 PM – 8:00 PM`,

  ASK_ADDRESS: () =>
    `📍 Please share your service address or drop a location pin.`,

  ASK_NAME: () =>
    `👤 What's your name?`,

  ASK_PHONE: () =>
    `📞 Your mobile number? (for order confirmation)`,

  ORDER_SUMMARY: (session) => {
    const { cart, info } = session;
    const serviceLine = cart.subCategory
      ? `${cart.packageName} (${cart.subCategory})`
      : cart.packageName;
    const vehicleLine = cart.vehicleType ? `\n🚘 Vehicle: ${cart.vehicleType}` : '';
    const quantityLine = cart.quantity > 1 ? `\n🔢 Quantity: ${cart.quantity}` : '';
    const extrasTotal = (cart.extras || []).reduce((s, e) => s + e.price * e.qty, 0);
    const total = cart.packagePrice + extrasTotal;

    return `📋 *Order Summary*
━━━━━━━━━━━━━━━━━━━━
🛠️ Service: ${serviceLine}${vehicleLine}${quantityLine}
📅 Date: ${info.date}
⏰ Time: ${info.timeSlot}
📍 Location: ${info.address}
👤 Name: ${info.name}
📞 ${info.phone}
━━━━━━━━━━━━━━━━━━━━
💰 *Total: ${fmt(total)}*

1️⃣  ✅ Confirm & Pay
2️⃣  ✏️ Edit Details
3️⃣  ❌ Cancel`;
  },

  PAYMENT_OPTIONS: (total, payLink) =>
    `💳 *Payment Options*

1️⃣  Pay Online (UPI / Card / Net Banking)
    🔗 ${payLink}

2️⃣  Pay on Arrival (Cash / UPI at doorstep)

Reply *1* or *2*.`,

  ORDER_CONFIRMED: (orderNumber, session) => {
    const { cart, info } = session;
    return `🎉 *Booking Confirmed!*

Order ID: #${orderNumber}
🛠️ Service: ${cart.packageName}${cart.vehicleType ? ` (${cart.vehicleType})` : ''}
📅 ${info.date} | ${info.timeSlot}
📍 ${info.address}

Our team will arrive on time. You'll receive a reminder 30 mins before! 🚀

📞 Need help? Reply *HELP* or call +91 95915 72775
🔄 Track order: Reply *STATUS*`;
  },

  OFFERS: () =>
    `🎉 *Current Offers*

• Use code *NEWUSER* — ₹50 off your first order
• Use code *BFS10* — 10% off on orders above ₹499
• Monthly plans save up to ₹100/month on car/bike wash

Reply *MENU* to book now!`,

  QUOTE_REQUEST: () =>
    `📝 *Custom Quote Request*

Please describe your requirement (type of space, area in sq. ft., frequency) and we'll get back to you within 2 hours.

📞 Or call us directly: *+91 95915 72775*`,

  STATUS_NO_ORDER: () =>
    `ℹ️ No active order found for your number.

Reply *MENU* to place a new booking.`,

  CANCEL_CONFIRM: () =>
    `❌ Your current booking request has been cancelled.

Reply *MENU* to start a new booking.`,

  RESCHEDULE_PROMPT: () =>
    `📅 *Reschedule Booking*

Please enter the new date in *DD/MM/YYYY* format.`,

  INVALID_INPUT: () =>
    `⚠️ I didn't understand that. Please reply with a valid option number.

Type *MENU* to go back to the main menu or *HELP* to speak to an agent.`,

  DATE_INVALID: () =>
    `⚠️ Invalid date format. Please reply in *DD/MM/YYYY* format and ensure the date is in the future (e.g., *20/04/2025*).`,

  PHONE_INVALID: () =>
    `⚠️ That doesn't look like a valid Indian mobile number. Please enter a 10-digit number (e.g., *9876543210*).`,
};

// ─── State machine ────────────────────────────────────────────────────────────

/**
 * Process a customer message and return the bot's reply + next state.
 *
 * @param {object} session - Current session object (mutated in place)
 * @param {string} text    - Raw message text from customer
 * @returns {{ reply: string, nextState: string, orderReady: boolean }}
 */
export function processMessage(session, text) {
  const input = normalize(text);
  const n = num(input);

  // ── Global commands (work from any state) ─────────────────────────────────
  if (['menu', 'hi', 'hello', 'helo', 'start', 'hey'].includes(input)) {
    resetCart(session);
    return { reply: MESSAGES.MAIN_MENU(), nextState: 'MAIN_MENU' };
  }
  if (input === 'help') {
    return { reply: MESSAGES.HUMAN_AGENT(), nextState: session.state };
  }
  if (input === 'offers') {
    return { reply: MESSAGES.OFFERS(), nextState: session.state };
  }
  if (input === 'quote') {
    return { reply: MESSAGES.QUOTE_REQUEST(), nextState: 'QUOTE' };
  }
  if (input === 'status') {
    return { reply: null, nextState: 'STATUS_LOOKUP' }; // controller handles DB lookup
  }
  if (input === 'cancel') {
    resetCart(session);
    return { reply: MESSAGES.CANCEL_CONFIRM(), nextState: 'MAIN_MENU' };
  }
  if (input === 'reschedule') {
    return { reply: MESSAGES.RESCHEDULE_PROMPT(), nextState: 'RESCHEDULE_DATE' };
  }

  // ── State-specific handlers ────────────────────────────────────────────────
  switch (session.state) {
    case 'MAIN_MENU':
      return handleMainMenu(session, input, n);

    // Car wash
    case 'CAR_PACKAGE':
      return handleCarPackage(session, input, n);
    case 'CAR_VEHICLE':
      return handleCarVehicle(session, n);

    // Bike wash
    case 'BIKE_PACKAGE':
      return handleBikePackage(session, n);
    case 'BIKE_TYPE':
      return handleBikeType(session, n);

    // Laundry
    case 'LAUNDRY_PACKAGE':
      return handleLaundryPackage(session, n);
    case 'LAUNDRY_QUANTITY':
      return handleLaundryQuantity(session, input);

    // Home instant
    case 'HOME_INSTANT_CAT':
      return handleHomeInstantCat(session, n);
    case 'HOME_CARE':
      return handleHomeInstantItems(session, input, HOME_CARE_SERVICES, 'home_care');
    case 'KITCHEN_CARE':
      return handleHomeInstantItems(session, input, KITCHEN_SERVICES, 'kitchen_care');
    case 'BATHROOM_INSTANT':
      return handleHomeInstantItems(session, input, BATHROOM_INSTANT_SERVICES, 'bathroom_instant');
    case 'LAUNDRY_INSTANT':
      return handleLaundryInstant(session, text);
    case 'COMMON_AREA':
      return handleHomeInstantItems(session, input, COMMON_AREA_SERVICES, 'common_area');
    case 'COMBO_PACKS':
      return handleHomeInstantItems(session, input, COMBO_PACKS, 'combo_packs');

    // Home deep cleaning
    case 'HOME_DEEP_FURNISH':
      return handleHomeDeepFurnish(session, n);
    case 'HOME_DEEP_SIZE':
      return handleHomeDeepSize(session, n);

    // Bathroom deep cleaning
    case 'BATHROOM_DEEP':
      return handleBathroomDeep(session, n);

    // Commercial
    case 'COMMERCIAL':
      return handleCommercial(session, input, n);

    // Key & lock
    case 'KEY_LOCK':
      return handleKeyLock(session, n);

    // Booking details
    case 'ASK_DATE':
      return handleDate(session, input);
    case 'ASK_TIME':
      return handleTimeSlot(session, n);
    case 'ASK_ADDRESS':
      return handleAddress(session, text);
    case 'ASK_NAME':
      return handleName(session, text);
    case 'ASK_PHONE':
      return handlePhone(session, input);

    // Order summary
    case 'ORDER_SUMMARY':
      return handleOrderSummary(session, n);

    // Payment choice
    case 'PAYMENT_CHOICE':
      return handlePaymentChoice(session, n);

    // Rescheduling
    case 'RESCHEDULE_DATE':
      return handleRescheduleDate(session, input);

    default:
      resetCart(session);
      return { reply: MESSAGES.MAIN_MENU(), nextState: 'MAIN_MENU' };
  }
}

// ─── Individual state handlers ────────────────────────────────────────────────

function handleMainMenu(session, input, n) {
  switch (n) {
    case 1:
      session.cart.category = 'car_wash';
      return { reply: MESSAGES.CAR_PACKAGE(), nextState: 'CAR_PACKAGE' };
    case 2:
      session.cart.category = 'bike_wash';
      return { reply: MESSAGES.BIKE_PACKAGE(), nextState: 'BIKE_PACKAGE' };
    case 3:
      session.cart.category = 'laundry';
      return { reply: MESSAGES.LAUNDRY_PACKAGE(), nextState: 'LAUNDRY_PACKAGE' };
    case 4:
      session.cart.category = 'home_instant';
      return { reply: MESSAGES.HOME_INSTANT_CAT(), nextState: 'HOME_INSTANT_CAT' };
    case 5:
      session.cart.category = 'home_deep';
      return { reply: MESSAGES.HOME_DEEP_FURNISH(), nextState: 'HOME_DEEP_FURNISH' };
    case 6:
      session.cart.category = 'bathroom_deep';
      return { reply: MESSAGES.BATHROOM_DEEP(), nextState: 'BATHROOM_DEEP' };
    case 7:
      session.cart.category = 'commercial';
      return { reply: MESSAGES.COMMERCIAL(), nextState: 'COMMERCIAL' };
    case 8:
      session.cart.category = 'key_lock';
      return { reply: MESSAGES.KEY_LOCK(), nextState: 'KEY_LOCK' };
    case 9:
      return { reply: MESSAGES.ACCESSORIES_REDIRECT(), nextState: 'MAIN_MENU' };
    case 10:
      return { reply: MESSAGES.CHECKUP_REDIRECT(), nextState: 'MAIN_MENU' };
    case 0:
      return { reply: MESSAGES.HUMAN_AGENT(), nextState: 'MAIN_MENU' };
    default:
      return { reply: MESSAGES.INVALID_INPUT(), nextState: 'MAIN_MENU' };
  }
}

function handleCarPackage(session, input, n) {
  // Monthly plan requests
  const monthlyMatch = input.match(/^m([123])$/);
  if (monthlyMatch) {
    const pkg = CAR_PACKAGES[parseInt(monthlyMatch[1]) - 1];
    return { reply: MESSAGES.CAR_MONTHLY(pkg), nextState: 'CAR_PACKAGE' };
  }
  if (n >= 1 && n <= CAR_PACKAGES.length) {
    const pkg = CAR_PACKAGES[n - 1];
    session.cart.packageName = pkg.name;
    session.cart.packagePrice = pkg.price;
    return { reply: MESSAGES.CAR_VEHICLE(), nextState: 'CAR_VEHICLE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'CAR_PACKAGE' };
}

function handleCarVehicle(session, n) {
  if (n >= 1 && n <= CAR_VEHICLE_TYPES.length) {
    session.cart.vehicleType = CAR_VEHICLE_TYPES[n - 1];
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'CAR_VEHICLE' };
}

function handleBikePackage(session, n) {
  if (n >= 1 && n <= BIKE_PACKAGES.length) {
    const pkg = BIKE_PACKAGES[n - 1];
    session.cart.packageName = pkg.name;
    session.cart.packagePrice = pkg.price;
    return { reply: MESSAGES.BIKE_TYPE(), nextState: 'BIKE_TYPE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'BIKE_PACKAGE' };
}

function handleBikeType(session, n) {
  if (n >= 1 && n <= BIKE_TYPES.length) {
    session.cart.vehicleType = BIKE_TYPES[n - 1];
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'BIKE_TYPE' };
}

function handleLaundryPackage(session, n) {
  if (n >= 1 && n <= LAUNDRY_PACKAGES.length) {
    const pkg = LAUNDRY_PACKAGES[n - 1];
    session.cart.packageName = pkg.name;
    session.cart.packagePrice = pkg.price;
    session.cart.subCategory = 'laundry_package';
    return { reply: MESSAGES.LAUNDRY_QUANTITY(pkg), nextState: 'LAUNDRY_QUANTITY' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'LAUNDRY_PACKAGE' };
}

function handleLaundryQuantity(session, input) {
  const qty = parseInt(input, 10);
  if (isNaN(qty) || qty <= 0) {
    return {
      reply: `⚠️ Please enter a valid quantity (e.g., *5*).`,
      nextState: 'LAUNDRY_QUANTITY',
    };
  }
  session.cart.quantity = qty;
  session.cart.packagePrice = session.cart.packagePrice * qty;
  return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
}

function handleHomeInstantCat(session, n) {
  switch (n) {
    case 0:
      resetCart(session);
      return { reply: MESSAGES.MAIN_MENU(), nextState: 'MAIN_MENU' };
    case 1:
      return { reply: MESSAGES.HOME_CARE(), nextState: 'HOME_CARE' };
    case 2:
      return { reply: MESSAGES.KITCHEN_CARE(), nextState: 'KITCHEN_CARE' };
    case 3:
      return { reply: MESSAGES.BATHROOM_INSTANT(), nextState: 'BATHROOM_INSTANT' };
    case 4:
      return { reply: MESSAGES.LAUNDRY_INSTANT(), nextState: 'LAUNDRY_INSTANT' };
    case 5:
      return { reply: MESSAGES.COMMON_AREA(), nextState: 'COMMON_AREA' };
    case 6:
      return { reply: MESSAGES.COMBO_PACKS(), nextState: 'COMBO_PACKS' };
    default:
      return { reply: MESSAGES.INVALID_INPUT(), nextState: 'HOME_INSTANT_CAT' };
  }
}

/**
 * Generic handler for services listed as a numbered catalogue.
 * Supports comma-separated multi-select (e.g., "1,3,5").
 */
function handleHomeInstantItems(session, input, catalogue, categoryKey) {
  const indices = input
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= catalogue.length);

  if (indices.length === 0) {
    return { reply: MESSAGES.INVALID_INPUT(), nextState: session.state };
  }

  const selected = indices.map((i) => catalogue[i - 1]);
  session.cart.extras = selected.map((s) => ({ name: s.name, price: s.price, qty: 1 }));
  session.cart.packageName = selected.map((s) => s.name).join(', ');
  session.cart.packagePrice = selected.reduce((sum, s) => sum + s.price, 0);
  session.cart.subCategory = categoryKey;

  return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
}

function handleLaundryInstant(session, rawText) {
  // Try to parse "Laundry 5, Ironing 3" style input
  const parsed = [];
  let totalPrice = 0;

  for (const svc of LAUNDRY_INSTANT_SERVICES) {
    const re = new RegExp(svc.name + '\\s*(\\d+)', 'i');
    const m = rawText.match(re);
    if (m) {
      const qty = parseInt(m[1], 10);
      parsed.push({ name: svc.name, price: svc.price, qty });
      totalPrice += svc.price * qty;
    }
  }

  // Fall back to a simple number selection
  if (parsed.length === 0) {
    const n = num(rawText);
    if (n >= 1 && n <= LAUNDRY_INSTANT_SERVICES.length) {
      const svc = LAUNDRY_INSTANT_SERVICES[n - 1];
      session.cart.packageName = svc.name;
      session.cart.packagePrice = svc.price;
      session.cart.subCategory = 'laundry_instant';
      return {
        reply: `You selected *${svc.name}* (${fmt(svc.price)}/item).\n\nHow many items? Reply with a number.`,
        nextState: 'LAUNDRY_QUANTITY',
      };
    }
    return { reply: MESSAGES.INVALID_INPUT(), nextState: 'LAUNDRY_INSTANT' };
  }

  session.cart.extras = parsed;
  session.cart.packageName = parsed.map((p) => `${p.name} x${p.qty}`).join(', ');
  session.cart.packagePrice = totalPrice;
  session.cart.subCategory = 'laundry_instant';
  return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
}

function handleHomeDeepFurnish(session, n) {
  if (n === 1) {
    session.cart.subCategory = 'unfurnished';
    return { reply: MESSAGES.HOME_DEEP_SIZE('unfurnished'), nextState: 'HOME_DEEP_SIZE' };
  }
  if (n === 2) {
    session.cart.subCategory = 'furnished';
    return { reply: MESSAGES.HOME_DEEP_SIZE('furnished'), nextState: 'HOME_DEEP_SIZE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'HOME_DEEP_FURNISH' };
}

function handleHomeDeepSize(session, n) {
  const list = HOME_DEEP_CLEANING[session.cart.subCategory];
  if (n >= 1 && n <= list.length) {
    const item = list[n - 1];
    session.cart.packageName = `${item.bhk} ${session.cart.subCategory === 'unfurnished' ? 'Unfurnished' : 'Furnished'} Deep Cleaning`;
    session.cart.packagePrice = item.price;
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'HOME_DEEP_SIZE' };
}

function handleBathroomDeep(session, n) {
  if (n >= 1 && n <= BATHROOM_DEEP_PACKAGES.length) {
    const pkg = BATHROOM_DEEP_PACKAGES[n - 1];
    session.cart.packageName = pkg.name;
    session.cart.packagePrice = pkg.price;
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'BATHROOM_DEEP' };
}

function handleCommercial(session, input, n) {
  if (input === 'quote') {
    return { reply: MESSAGES.QUOTE_REQUEST(), nextState: 'QUOTE' };
  }
  if (n >= 1 && n <= COMMERCIAL_SERVICES.length) {
    const svc = COMMERCIAL_SERVICES[n - 1];
    session.cart.packageName = svc.name;
    session.cart.packagePrice = svc.price;
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'COMMERCIAL' };
}

function handleKeyLock(session, n) {
  if (n >= 1 && n <= KEY_LOCK_SERVICES.length) {
    const svc = KEY_LOCK_SERVICES[n - 1];
    session.cart.packageName = svc.name;
    session.cart.packagePrice = svc.price;
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'KEY_LOCK' };
}

// ── Booking details ───────────────────────────────────────────────────────────

function handleDate(session, input) {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const m = input.match(dateRegex);
  if (!m) return { reply: MESSAGES.DATE_INVALID(), nextState: 'ASK_DATE' };

  const [, dd, mm, yyyy] = m;
  const parsed = new Date(`${yyyy}-${mm}-${dd}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(parsed.getTime()) || parsed < today) {
    return { reply: MESSAGES.DATE_INVALID(), nextState: 'ASK_DATE' };
  }

  session.info.date = `${dd}/${mm}/${yyyy}`;
  return { reply: MESSAGES.ASK_TIME(), nextState: 'ASK_TIME' };
}

function handleTimeSlot(session, n) {
  if (n >= 1 && n <= TIME_SLOTS.length) {
    session.info.timeSlot = TIME_SLOTS[n - 1];
    return { reply: MESSAGES.ASK_ADDRESS(), nextState: 'ASK_ADDRESS' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'ASK_TIME' };
}

function handleAddress(session, text) {
  const trimmed = text.trim();
  if (trimmed.length < 5) {
    return {
      reply: `⚠️ Please provide a full address (at least house number, street and area).`,
      nextState: 'ASK_ADDRESS',
    };
  }
  session.info.address = trimmed;
  return { reply: MESSAGES.ASK_NAME(), nextState: 'ASK_NAME' };
}

function handleName(session, text) {
  const name = text.trim();
  if (name.length < 2) {
    return { reply: `⚠️ Please enter your full name.`, nextState: 'ASK_NAME' };
  }
  session.info.name = name;
  return { reply: MESSAGES.ASK_PHONE(), nextState: 'ASK_PHONE' };
}

function handlePhone(session, input) {
  const cleaned = input.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { reply: MESSAGES.PHONE_INVALID(), nextState: 'ASK_PHONE' };
  }
  session.info.phone = `+91${cleaned}`;
  return { reply: MESSAGES.ORDER_SUMMARY(session), nextState: 'ORDER_SUMMARY' };
}

// ── Order confirmation ────────────────────────────────────────────────────────

function handleOrderSummary(session, n) {
  if (n === 1) {
    // Signal to controller to create order + payment link
    return { reply: null, nextState: 'CREATE_ORDER', orderReady: true };
  }
  if (n === 2) {
    // Edit — go back to date collection
    session.info = { date: null, timeSlot: null, address: null, name: null, phone: null };
    return { reply: MESSAGES.ASK_DATE(), nextState: 'ASK_DATE' };
  }
  if (n === 3) {
    resetCart(session);
    return { reply: MESSAGES.CANCEL_CONFIRM(), nextState: 'MAIN_MENU' };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'ORDER_SUMMARY' };
}

function handlePaymentChoice(session, n) {
  if (n === 1) {
    // Online — signal controller to send Razorpay link (already stored in session)
    return { reply: null, nextState: 'SEND_PAY_LINK' };
  }
  if (n === 2) {
    // Cash / pay on arrival
    return {
      reply: MESSAGES.ORDER_CONFIRMED(session.orderNumber, session),
      nextState: 'DONE',
    };
  }
  return { reply: MESSAGES.INVALID_INPUT(), nextState: 'PAYMENT_CHOICE' };
}

function handleRescheduleDate(session, input) {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const m = input.match(dateRegex);
  if (!m) return { reply: MESSAGES.DATE_INVALID(), nextState: 'RESCHEDULE_DATE' };

  const [, dd, mm, yyyy] = m;
  const parsed = new Date(`${yyyy}-${mm}-${dd}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(parsed.getTime()) || parsed < today) {
    return { reply: MESSAGES.DATE_INVALID(), nextState: 'RESCHEDULE_DATE' };
  }

  session.info.date = `${dd}/${mm}/${yyyy}`;
  return { reply: MESSAGES.ASK_TIME(), nextState: 'RESCHEDULE_TIME' };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function resetCart(session) {
  session.cart = {
    category: null,
    packageName: null,
    packagePrice: 0,
    vehicleType: null,
    subCategory: null,
    quantity: 1,
    extras: [],
  };
  session.info = { date: null, timeSlot: null, address: null, name: null, phone: null };
  session.orderId = null;
  session.razorpayOrderId = null;
  session.orderNumber = null;
}

/**
 * Build the Order document payload ready to be passed to the Order model.
 *
 * @param {object} session - Completed session
 * @param {string} userId  - MongoDB user _id (string)
 * @param {string} paymentMethod - 'cash' | 'upi'
 */
export function buildOrderPayload(session, userId, paymentMethod = 'cash') {
  const { cart, info } = session;
  const [dd, mm, yyyy] = info.date.split('/');
  const scheduledDate = new Date(`${yyyy}-${mm}-${dd}`);

  const extrasTotal = (cart.extras || []).reduce((s, e) => s + e.price * e.qty, 0);
  const subtotal = cart.packagePrice;
  const taxRate = 0.18;
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));

  return {
    userId,
    items: [
      {
        serviceId: undefined, // WhatsApp orders don't have a DB service reference
        serviceName: cart.packageName,
        packageName: cart.packageName,
        vehicleType: cart.vehicleType || undefined,
        quantity: cart.quantity || 1,
        price: cart.packagePrice,
        type: cart.category,
        category: cart.subCategory || cart.category,
        uiAddOns: (cart.extras || []).map((e) => ({
          name: e.name,
          price: e.price,
          quantity: e.qty,
        })),
      },
    ],
    serviceAddress: {
      fullAddress: info.address,
      phone: info.phone,
    },
    scheduledDate,
    scheduledTimeSlot: info.timeSlot,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    customerNotes: `WhatsApp booking. Customer: ${info.name}, Phone: ${info.phone}`,
  };
}
