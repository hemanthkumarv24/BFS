# MobileFix Pro - Quick Deployment Guide

## 🚀 Quick Start (For Production Deployment)

This guide helps you quickly deploy the updated MobileFix Pro feature with 400+ phone models.

## Prerequisites

- MongoDB instance (local or cloud)
- Node.js v16+ installed
- Environment variables configured

## Step-by-Step Deployment

### 1. Configure Environment Variables

Create or update `.env` file in the `server` directory:

```bash
# Required MongoDB Connection
MONGO_URI=mongodb://localhost:27017/bfs
# Or use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bfs?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret (use a secure random string)
JWT_SECRET=your_secure_jwt_secret_here_change_this

# Optional Fallback DB
MONGO_URI_FALLBACK=your_fallback_mongodb_uri_here
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Seed the Database

Run the MobileFix seed script to populate brands, models, and pricing:

```bash
npm run seed:mobilefix
```

**Expected Output:**
```
Connected to MongoDB
Clearing existing data...
Seeding phone brands...
Created 9 brands
Seeding phone models...
Created 400+ models
Seeding pricing data...
Created 2400+ pricing entries

✅ MobileFix Pro data seeded successfully!

Summary:
- Brands: 9
- Models: 400+
- Pricing entries: 2400+
```

### 4. Start the Backend Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server should start on `http://localhost:5000`

### 5. Configure Frontend Environment

Create or update `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:5000
# For production, use your production API URL
# VITE_API_URL=https://your-api-domain.com
```

### 6. Install Frontend Dependencies

```bash
cd ..  # Return to project root
npm install
```

### 7. Start the Frontend

```bash
# Development
npm run dev

# Build for production
npm run build
npm run preview
```

Frontend should start on `http://localhost:5173`

### 8. Verify the Setup

1. Open browser: `http://localhost:5173/mobilefix`
2. You should see:
   - 9 brand cards (Samsung, Apple, Redmi, etc.)
   - Click on any brand to see models
   - Click on a model to see available services with pricing

## 🔍 Quick Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] Environment variables are set correctly
- [ ] Seed script completed successfully
- [ ] Backend server is running (check: `http://localhost:5000/api/health`)
- [ ] Frontend is running
- [ ] Brands are visible on MobileFix page
- [ ] Models appear when brand is selected
- [ ] Services show pricing when model is selected
- [ ] Can add service to cart

## 🛠️ What Was Updated

### Database Changes
- **Brands**: No change (still 9 brands)
- **Models**: Expanded from ~30 to 400+ models
- **Pricing**: Generated for all model-service combinations

### Brands Included
1. **Samsung** (70+ models) - Galaxy S, Z, A, M, F series
2. **Apple** (30+ models) - iPhone 15 down to iPhone 6
3. **Redmi** (50+ models) - Note, K, Number, A series
4. **Vivo** (50+ models) - V, X, Y, T series
5. **Oppo** (50+ models) - Find, Reno, F, A series
6. **OnePlus** (30+ models) - Flagship, Nord, Ace series
7. **Realme** (60+ models) - Number, GT, Narzo, C series
8. **Motorola** (40+ models) - Edge, Razr, G, E series
9. **Others** (30+ models) - Various manufacturers

### Service Types (6 total)
- Screen Replacement
- Battery Replacement
- Charging Port Replacement
- Speaker/Microphone Replacement
- Camera Glass Replacement
- Phone Cleaning & Diagnostics

### Pricing Logic
- Base pricing varies by service type
- **Apple**: 1.5x multiplier (premium pricing)
- **Samsung**: 1.2x multiplier
- **OnePlus**: 1.2x multiplier
- **Others**: 1.0x base pricing
- **First-time users**: 15% discount applied at checkout

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Verify MongoDB is running: `mongosh` (for local)
- Check `MONGO_URI` in `.env` file
- Ensure network access if using MongoDB Atlas

### Issue: "No brands appearing on frontend"
**Solution:**
- Verify seed script ran successfully
- Check backend console for errors
- Test API directly: `curl http://localhost:5000/api/mobilefix/brands`
- Check browser console for CORS or network errors

### Issue: "Models not loading after brand selection"
**Solution:**
- Verify models were seeded for that brand
- Check API: `curl http://localhost:5000/api/mobilefix/brands/{brandId}/models`
- Check backend logs for errors

### Issue: "Pricing not showing"
**Solution:**
- Verify pricing data was seeded
- Check if model has pricing: `curl http://localhost:5000/api/mobilefix/pricing/model/{modelId}`
- Ensure service type matches available services

### Issue: "Port already in use"
**Solution:**
- Change `PORT` in `.env` file
- Kill existing process: `lsof -ti:5000 | xargs kill` (Mac/Linux)
- Or use different port: `PORT=5001 npm start`

## 📊 Database Statistics After Seeding

```
Collections:
- phonebrands: 9 documents
- phonemodels: 400+ documents
- mobilefixpricing: 2400+ documents
```

To verify in MongoDB:
```javascript
use bfs
db.phonebrands.countDocuments()    // Should return 9
db.phonemodels.countDocuments()     // Should return 400+
db.mobilefixpricing.countDocuments() // Should return 2400+
```

## 🔒 Security Notes

- Always use strong `JWT_SECRET` in production
- Never commit `.env` file to version control
- Use environment-specific configurations
- Enable HTTPS in production
- Validate all user inputs on backend

## 📝 API Testing

Test the endpoints manually:

```bash
# List all brands
curl http://localhost:5000/api/mobilefix/brands

# List models for Samsung (replace {id} with actual brand ID)
curl http://localhost:5000/api/mobilefix/brands/{id}/models

# Get pricing for a model (replace {id} with actual model ID)
curl http://localhost:5000/api/mobilefix/pricing/model/{id}

# Health check
curl http://localhost:5000/api/health
```

## 📱 Frontend User Flow

1. **Landing Page** → User sees hero section with CTA
2. **Select Brand** → Grid of 9 brand cards
3. **Select Model** → Comprehensive list of models per brand
4. **Select Service** → 6 service types with prices
5. **Review Summary** → Shows brand, model, service, price, discount
6. **Add to Cart** → Service added with all details
7. **Checkout** → Address, date/time selection
8. **Booking** → Confirmation and technician assignment

## 🎯 Success Criteria

✅ All 9 brands display correctly  
✅ 400+ models accessible across brands  
✅ All services show appropriate pricing  
✅ First-time discount (15%) applies correctly  
✅ Cart functionality works seamlessly  
✅ Booking flow completes without errors  

## 📞 Support

If you encounter issues:
1. Check the main documentation: `MOBILEFIX_SETUP.md`
2. Review server logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure MongoDB connection is stable

## 🚀 Production Deployment Tips

### Using Render / Heroku / Railway
1. Set environment variables in platform dashboard
2. Ensure build command: `npm install && npm run build`
3. Start command: `npm start`
4. Run seed script after first deployment
5. Configure custom domain if needed

### Using Docker
```dockerfile
# Example Dockerfile structure
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Database Hosting
- **MongoDB Atlas** (Recommended): Free tier available, auto-scaling
- **Self-hosted**: Requires server maintenance
- **Railway/Render MongoDB**: Integrated options available

## 📈 Performance Considerations

- Index on `PhoneBrand.name` and `PhoneModel.brandId` (already configured)
- Consider pagination for large model lists (future enhancement)
- Cache frequently accessed brand/model data
- Use CDN for frontend assets in production

## 🔄 Future Updates

To add more models in the future:
1. Edit `server/seedMobileFix.js`
2. Add new model names to respective brand arrays
3. Run: `npm run seed:mobilefix`
4. Models will be added with automatic pricing

To adjust pricing:
1. Update `BRAND_PRICE_MULTIPLIERS` in `seedMobileFix.js`
2. Update `pricingRanges` if needed
3. Re-run seed script

---

**Last Updated:** December 2024  
**Version:** 2.0  
**Status:** Production Ready ✅
