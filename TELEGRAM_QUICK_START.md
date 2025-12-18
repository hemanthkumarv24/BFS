# Telegram Notification Quick Reference

## ✅ Implementation Status

The Telegram notification system is **fully implemented** and ready to use. Just add your credentials!

## 🚀 Quick Setup (3 Steps)

### 1. Create Bot & Get Token
- Open Telegram → Search `@BotFather`
- Send `/newbot` → Follow prompts
- Copy the bot token you receive

### 2. Get Your Chat ID
```bash
cd server
# Add bot token to .env first
npm run test:telegram
```
Copy the chat ID displayed

### 3. Configure .env
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_IDS=your_chat_id_here
FRONTEND_URL=http://localhost:3000
```

## 📨 What Gets Sent

When a customer places an order, you'll receive:
- 🆕 Order notification
- 🔗 Link to admin dashboard
- 👤 Customer details (name, phone, email)
- 📍 Service address
- 🛒 Items ordered with pricing
- 💰 Payment summary (with GST breakdown)
- 📅 Scheduled date/time
- 💳 Payment method & status

## 🧪 Test It

```bash
cd server
npm run test:telegram "Hello World"
```

## 📁 Files Modified

- ✅ `server/services/telegramService.js` - Added order link
- ✅ `server/.env.example` - Added Telegram config
- ✅ `.env.example` - Added Telegram config
- ✅ `README.md` - Added feature mention
- ✅ `TELEGRAM_SETUP.md` - Complete setup guide

## 🔧 Already Implemented

✅ Order creation notifications (orderController.js)
✅ Green booking notifications (greenBookingController.js)  
✅ Callback notifications (callbackController.js)
✅ Message formatting with full order details
✅ Automatic message splitting (4096 char limit)
✅ Multi-admin support
✅ Test script for debugging
✅ Markdown formatting support

## 📖 Full Documentation

See [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md) for complete setup instructions and troubleshooting.

## ⚠️ Important Notes

- Notifications are sent **asynchronously** (won't block order creation)
- Messages split automatically if too long
- Set `BASE_URL` or `FRONTEND_URL` in .env for order links
- Use `npm run test:telegram` to discover chat IDs
- Keep bot tokens secret - never commit to git
