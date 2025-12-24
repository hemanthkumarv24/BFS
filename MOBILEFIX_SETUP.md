# MobileFix Pro Setup Guide

## Overview
This guide provides instructions for setting up the MobileFix Pro feature with comprehensive phone brand and model data.

## What's Included

### Phone Brands (9 total)
1. **Samsung** - 70+ models
2. **Apple** - 30+ models  
3. **Redmi** - 50+ models
4. **Vivo** - 50+ models
5. **Oppo** - 50+ models
6. **OnePlus** - 30+ models
7. **Realme** - 60+ models
8. **Motorola** - 40+ models
9. **Others** - 30+ models (Xiaomi, Poco, Google Pixel, Nothing, etc.)

### Phone Models Per Brand

#### Samsung (70+ models)
- Galaxy S Series: S24 Ultra, S24+, S24, S23 Ultra, S23+, S23, S22 Ultra, S22+, S22, S21 series, S20 series
- Galaxy Z Series (Foldable): Z Fold 5/4/3, Z Flip 5/4/3
- Galaxy A Series: A54 5G, A53 5G, A52, A34 5G, A33 5G, A32, A24, A23, A14, A13, A12, A04, A03
- Galaxy M Series: M54 5G, M53 5G, M52 5G, M34 5G, M33 5G, M32, M14 5G, M13, M12
- Galaxy F Series: F54 5G, F53 5G, F34 5G, F33 5G, F32, F14 5G, F13, F12

#### Apple (30+ models)
- iPhone 15 Series: 15 Pro Max, 15 Pro, 15 Plus, 15
- iPhone 14 Series: 14 Pro Max, 14 Pro, 14 Plus, 14
- iPhone 13 Series: 13 Pro Max, 13 Pro, 13, 13 mini
- iPhone 12 Series: 12 Pro Max, 12 Pro, 12, 12 mini
- iPhone 11 Series: 11 Pro Max, 11 Pro, 11
- iPhone XS/XR Series: XS Max, XS, XR, X
- iPhone SE Series: SE (2022), SE (2020)
- Older Models: 8 Plus, 8, 7 Plus, 7, 6s series, 6 series

#### Redmi (50+ models)
- Redmi Note Series: Note 13 Pro+, Note 13 Pro, Note 13, Note 12 series, Note 11 series, Note 10 series
- Redmi K Series: K70 Pro, K70, K60 Pro, K60, K50i, K40, K30 Pro, K20 Pro
- Redmi Number Series: 13C, 12C, 12, 11 Prime, 10 series, 9 series, 8 series, 7 series
- Redmi A Series: A3, A2, A1

#### Vivo (50+ models)
- Vivo V Series: V30 Pro, V30, V29 Pro, V29, V27 Pro, V27, V25 Pro, V25, V23 Pro, V23
- Vivo X Series: X100 Pro, X100, X90 Pro, X90, X80 Pro, X80, X70 series, X60 series
- Vivo Y Series: Y100, Y56 5G, Y55 5G, Y36, Y35, Y33T, Y27, Y22, Y21, Y20, Y17, Y16, Y15
- Vivo T Series: T3 5G, T2 Pro 5G, T2 5G, T2x 5G, T1 Pro 5G, T1 5G

#### Oppo (50+ models)
- Oppo Find Series: Find X7 Ultra, Find X7, Find X6 Pro, Find X5 Pro, Find X3 Pro, Find N3
- Oppo Reno Series: Reno 11 Pro, Reno 11, Reno 10 series, Reno 9 series, Reno 8 series, Reno 7 series
- Oppo F Series: F23 5G, F21 Pro, F21s Pro, F19 series, F17 series, F15, F11 series
- Oppo A Series: A3 Pro, A79 5G, A78 5G, A77 series, A59 5G, A58, A57, A54, A53, A52

#### OnePlus (30+ models)
- OnePlus Flagship: 12, 12R, 11, 11R, 10 Pro, 10T, 10R, 9 series, 8 series, 7 series, 6 series
- OnePlus Nord Series: Nord 3, Nord 2T, Nord 2, Nord CE 4, CE 3, CE 2, CE 3 Lite
- OnePlus Ace Series: Ace 3, Ace 2 Pro, Ace 2, Ace

#### Realme (60+ models)
- Realme Number Series: 12 Pro+, 12 Pro, 12, 11 Pro+, 11 Pro, 10 series, 9 series, 8 series, 7 series, 6 series
- Realme GT Series: GT 5 Pro, GT 5, GT 3, GT 2 Pro, GT Neo 5, GT Neo 3T, GT Neo 3
- Realme Narzo Series: Narzo 70 Pro, Narzo 70, Narzo 60 series, Narzo 50 series, Narzo 30 series
- Realme C Series: C67, C65, C55, C53, C51, C35, C33, C31, C30, C25, C21, C20, C15

#### Motorola (40+ models)
- Motorola Edge Series: Edge 40 Pro, Edge 40, Edge 40 Neo, Edge 30 series, Edge 20 series
- Motorola Razr Series: Razr 40 Ultra, Razr 40, Razr 2022, Razr 5G
- Motorola G Series: G84 5G, G73 5G, G72, G71, G62 5G, G61, G60, G52, G51 5G, G50, G42, G41, G40 Fusion
- Motorola E Series: E13, E32, E22, E20

#### Others (30+ models)
Xiaomi, Poco, Google Pixel, Nothing, Asus ROG, Sony Xperia, Tecno, Infinix, Lava, Nokia, and more

## Service Types Supported
Each model can have pricing configured for:
1. **Screen Replacement** (30-45 minutes, ₹1,500-₹8,000)
2. **Battery Replacement** (20-30 minutes, ₹800-₹2,500)
3. **Charging Port Replacement** (20-30 minutes, ₹500-₹1,500)
4. **Speaker/Microphone Replacement** (20-30 minutes, ₹600-₹1,800)
5. **Camera Glass Replacement** (15-25 minutes, ₹400-₹1,200)
6. **Phone Cleaning & Diagnostics** (30-40 minutes, ₹299-₹499)

## Setup Instructions

### 1. Configure Environment Variables
Ensure your `.env` file in the server directory has:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Run the Seed Script
```bash
npm run seed:mobilefix
```

This will:
- Clear existing phone brands, models, and pricing data
- Create 9 phone brands
- Create 400+ phone models across all brands
- Generate pricing for all service types for each model
- Apply brand-specific pricing (Apple models 50% higher, Samsung/OnePlus 20% higher)

### 4. Verify the Data
After seeding, you should see:
```
✅ MobileFix Pro data seeded successfully!

Summary:
- Brands: 9
- Models: 400+
- Pricing entries: 2400+
```

### 5. Start the Server
```bash
npm start
# or for development
npm run dev
```

### 6. Access the Frontend
Navigate to the MobileFix page:
```
http://localhost:5173/mobilefix
```

## User Flow

1. **Select Brand**: User sees all 9 brands displayed in a grid
2. **Select Model**: After brand selection, comprehensive list of models appears
3. **Select Service**: User chooses from 6 repair services
4. **View Pricing**: Price displays automatically based on model and service
5. **Apply Discount**: First-time users get 15% discount
6. **Add to Cart**: Service added to cart with full details
7. **Complete Booking**: User proceeds to checkout with address and date/time selection

## API Endpoints

### Public Endpoints
- `GET /api/mobilefix/brands` - List all active brands
- `GET /api/mobilefix/brands/:brandId/models` - List models for a brand
- `GET /api/mobilefix/pricing/model/:modelId` - Get all pricing for a model

### Protected Endpoints (Require Authentication)
- `POST /api/mobilefix/booking` - Create new booking
- `GET /api/mobilefix/my-bookings` - Get user's bookings
- `GET /api/mobilefix/check-first-time` - Check if first-time user

## Database Schema

### PhoneBrand
```javascript
{
  name: String (unique),
  isActive: Boolean,
  displayOrder: Number
}
```

### PhoneModel
```javascript
{
  brandId: ObjectId (ref: PhoneBrand),
  name: String,
  isActive: Boolean,
  displayOrder: Number
}
```

### MobileFixPricing
```javascript
{
  modelId: ObjectId (ref: PhoneModel),
  serviceType: String (enum),
  price: Number,
  estimatedTime: String,
  isActive: Boolean
}
```

## Testing

### Manual Testing Steps
1. Open the MobileFix page
2. Click on "Samsung" brand
3. Verify 70+ models appear
4. Select "Galaxy S23 Ultra"
5. Verify all 6 services show with prices
6. Select "Screen Replacement"
7. Verify pricing summary shows correctly
8. Add to cart and proceed to checkout

### Test Different Scenarios
- [ ] Test all 9 brands load correctly
- [ ] Test models appear after brand selection
- [ ] Test pricing displays for all services
- [ ] Test first-time user discount (15%)
- [ ] Test add to cart functionality
- [ ] Test complete booking flow

## Troubleshooting

### No Brands Appearing
- Check if seed script ran successfully
- Verify MongoDB connection
- Check browser console for errors

### Models Not Loading
- Verify brand ID is being passed correctly
- Check API endpoint: `/api/mobilefix/brands/:brandId/models`
- Verify models were seeded for that brand

### Pricing Not Showing
- Ensure pricing was seeded for the selected model
- Check if model ID is correct
- Verify service type matches enum values

### 404 Errors
- Ensure server is running on correct port
- Verify VITE_API_URL environment variable
- Check CORS configuration

## Maintenance

### Adding New Models
1. Edit `server/seedMobileFix.js`
2. Add model names to respective brand array
3. Run seed script: `npm run seed:mobilefix`

### Updating Pricing
1. Modify pricing ranges in `seedMobileFix.js`
2. Re-run seed script to update prices
3. Alternatively, update via admin panel

### Adding New Brands
1. Add brand to `brandsData` array
2. Add models in `modelsData` object
3. Run seed script

## Support
For issues or questions, contact the development team or create an issue in the repository.
