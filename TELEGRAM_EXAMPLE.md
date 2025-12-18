# Example Telegram Notification

This is what admins will receive when a customer places an order:

```
🆕 NEW BOOKING
Order ID: BFS123456789
🔗 [View Order](https://yourdomain.com/admin/orders)

Customer Information
Name: Rajesh Kumar
Phone: +91 9876543210
Email: rajesh.kumar@example.com

Service Address
#45, 2nd Cross, Jayanagar 4th Block
Bangalore, Karnataka, 560011
Landmark: Near City Bank

Service Details
2 items

Item 1
Base Service: Car Wash - Premium Package
Vehicle: Sedan
₹699 each
Included Features:
 - Complete exterior wash
 - Interior vacuuming
 - Dashboard cleaning
 - Tyre polish
 - Air freshener
 - Wax polish
Add-ons:
 + Engine bay cleaning ₹200 x1
Quantity: 1
Item Total: ₹899

Item 2
Base Service: Bike Wash - Quick Package
Vehicle: Commuter
₹99 each
Included Features:
 - Basic wash
 - Chain cleaning
Quantity: 1
Item Total: ₹99

Order Summary
Subtotal: ₹998
Discount (WELCOME50): -₹100
Taxable: ₹898
CGST (9%): ₹80.82
SGST (9%): ₹80.82
Total: ₹1,059.64

Scheduling Information
Booking Date: Dec 18, 2025
Scheduled Date: Dec 19, 2025
Time Slot: 10:00 AM - 12:00 PM

Payment Information
Payment Method: online
Payment Status: Completed
Estimated Duration: 90 minutes
Coupon Applied: WELCOME50

Order Status
Confirmed

Customer Notes
Please park the car in the basement

— BFS Bot
```

## Key Features in Notification

✅ **Clickable Order Link** - Direct access to admin orders page  
✅ **Complete Customer Info** - Name, phone, email  
✅ **Detailed Address** - Full address with landmark  
✅ **Service Breakdown** - All items with features and add-ons  
✅ **Price Details** - Including GST breakdown (CGST + SGST)  
✅ **Schedule Info** - Date and time slot  
✅ **Payment Details** - Method, status, coupon used  
✅ **Customer Notes** - Any special instructions  

## Notification Timing

- Sent **immediately** when order is created
- Sent **asynchronously** (doesn't slow down checkout)
- Delivered to **all configured admin chat IDs**
- **Automatically split** if message exceeds 4096 characters
