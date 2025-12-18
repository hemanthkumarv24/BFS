# Telegram Admin Notifications Setup Guide

This guide will help you set up Telegram notifications for admin alerts when new orders are placed.

## Features

✅ **Real-time order notifications** - Get instant alerts when customers place orders  
✅ **Comprehensive order details** - See customer info, service details, payment info, and more  
✅ **Order links** - Direct links to view orders in the admin dashboard  
✅ **Multiple admin support** - Send notifications to multiple admin chat IDs  
✅ **Message splitting** - Automatically splits long messages to stay within Telegram limits  

## Setup Instructions

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to choose a name and username for your bot
4. You'll receive a **bot token** that looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
5. Save this token - you'll need it in Step 3

### Step 2: Get Your Chat ID

#### Option A: Using the Test Script (Recommended)

1. In Telegram, search for your bot using the username you created
2. Click "Start" and send any message to your bot
3. In your project, set the bot token in `.env`:
   ```bash
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```
4. Run the test script:
   ```bash
   cd server
   npm run test:telegram
   ```
5. The script will display discovered chat IDs from your bot's message history

#### Option B: Manual Method

1. Send a message to your bot in Telegram
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for the `"chat":{"id":123456789}` field in the response
4. Copy the chat ID number

### Step 3: Configure Environment Variables

Add the following to your `.env` file:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_IDS=123456789,987654321
FRONTEND_URL=http://localhost:3000
```

Or for production:
```bash
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_ADMIN_CHAT_IDS=admin1_chat_id,admin2_chat_id,admin3_chat_id
FRONTEND_URL=https://yourdomain.com
```

**Notes:**
- `TELEGRAM_BOT_TOKEN` - Your bot token from @BotFather
- `TELEGRAM_ADMIN_CHAT_IDS` - Comma-separated list of chat IDs to receive notifications
- `FRONTEND_URL` - Your app's frontend URL (used for order links). Can also use `BASE_URL` variable.

### Step 4: Test the Setup

Send a test message to verify everything is working:

```bash
cd server
npm run test:telegram "Hello from BFS! 🚀"
```

If configured correctly, you should receive the test message in Telegram.

### Step 5: Verify Order Notifications

1. Create a test order through your application
2. Check your Telegram bot for the notification
3. The notification should include:
   - Order ID
   - Link to view order in admin panel
   - Customer information
   - Service details
   - Payment information
   - Order summary

## Notification Format

When an order is placed, admins receive a message like:

```
🆕 NEW BOOKING
Order ID: BFS123456789
🔗 [View Order](https://yourdomain.com/admin/orders)

Customer Information
Name: John Doe
Phone: +91 9876543210
Email: john@example.com

Service Address
123 Main Street
Bangalore, Karnataka, 560001

Service Details
2 items

Item 1
Base Service: Car Wash - Premium Package
Vehicle: Sedan
₹500 each
Included Features:
 - Exterior wash
 - Interior cleaning
 - Wax polish
Quantity: 1
Item Total: ₹500

Order Summary
Subtotal: ₹500
Taxable: ₹500
CGST (9%): ₹45
SGST (9%): ₹45
Total: ₹590

Scheduling Information
Booking Date: Dec 18, 2025
Scheduled Date: Dec 19, 2025
Time Slot: 10:00 AM - 12:00 PM

Payment Information
Payment Method: online
Payment Status: Completed

Order Status
Confirmed

— BFS Bot
```

## Troubleshooting

### Bot Not Sending Messages

1. **Check bot token**: Verify `TELEGRAM_BOT_TOKEN` is correct in `.env`
2. **Check chat IDs**: Ensure `TELEGRAM_ADMIN_CHAT_IDS` are valid
3. **Start the bot**: Make sure you've sent `/start` to your bot in Telegram
4. **Check logs**: Look for errors in server console starting with `[telegramService]`

### Not Receiving Notifications

1. **Verify bot is running**: Restart your server after updating `.env`
2. **Check environment**: Ensure `.env` file is loaded (using `dotenv/config`)
3. **Test the connection**: Run `npm run test:telegram "Test message"`
4. **Review bot permissions**: Make sure your bot isn't blocked

### Chat ID Not Found

1. **Send a message first**: You must send at least one message to your bot
2. **Use the test script**: Run `npm run test:telegram` to discover chat IDs
3. **Check bot username**: Ensure you're messaging the correct bot

## Implementation Details

### Files Involved

- `server/services/telegramService.js` - Core Telegram service
- `server/controllers/orderController.js` - Order notifications (lines 372-380)
- `server/controllers/greenBookingController.js` - Green service notifications
- `server/controllers/callbackController.js` - Callback notifications
- `server/scripts/testTelegram.js` - Testing utility

### How It Works

1. When an order is created via `orderController.createOrder()`
2. After the order is saved to database
3. `formatOrderMessage()` creates a rich text message with order details
4. `broadcastToAdmins()` sends the message to all configured admin chat IDs
5. Messages are automatically split if they exceed Telegram's 4096 character limit
6. Notifications are sent asynchronously (fire-and-forget) to not block order creation

### Supported Notification Types

Currently implemented for:
- ✅ Regular orders (car wash, bike wash, etc.)
- ✅ Green & Clean bookings
- ✅ Callback requests

## Security Best Practices

⚠️ **IMPORTANT**:

1. **Never commit tokens**: Add `.env` to `.gitignore` (already done)
2. **Use environment variables**: Always use `process.env` for sensitive data
3. **Rotate tokens regularly**: Generate new bot tokens periodically
4. **Limit bot permissions**: Only give necessary permissions to your bot
5. **Monitor usage**: Keep track of who has access to admin chat IDs

## Production Deployment

When deploying to production:

1. Set environment variables on your hosting platform (Heroku, AWS, etc.)
2. Use production bot token (create separate bot for production if needed)
3. Update `FRONTEND_URL` to your production domain
4. Test notifications after deployment
5. Set up monitoring for failed notifications

## Support

If you encounter issues:

1. Check server logs for `[telegramService]` messages
2. Run the test script: `npm run test:telegram`
3. Verify all environment variables are set correctly
4. Review Telegram Bot API docs: https://core.telegram.org/bots/api

## Additional Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Telegram Bot Features](https://core.telegram.org/bots/features)
