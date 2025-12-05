# Testing Guide for Mapbox Integration

This guide helps you test the new Mapbox integration for Movers & Packers location services.

## Prerequisites

### 1. Get Mapbox Access Token

1. Sign up at [https://account.mapbox.com/](https://account.mapbox.com/)
2. Navigate to "Access Tokens" in your account
3. Copy your default public token or create a new one
4. The token should start with `pk.`

### 2. Configure Environment Variables

#### Backend (.env file in /server directory)
```bash
MAPBOX_ACCESS_TOKEN=pk.your_actual_mapbox_token_here
```

#### Frontend (.env file in root directory)
```bash
VITE_MAPBOX_ACCESS_TOKEN=pk.your_actual_mapbox_token_here
```

**Note**: Without these tokens, the system will fall back to OpenStreetMap Nominatim (free but rate-limited).

## Backend Testing

### Test 1: Run Backend Test Script

```bash
cd server
node test-mapbox.js
```

Expected output:
- ✓ Reverse Geocoding test passes
- ✓ Address Search test passes
- ✓ Address Suggestions test passes

### Test 2: Test API Endpoints Manually

1. Start the backend server:
```bash
cd server
npm start
```

2. Test reverse geocoding:
```bash
curl -X POST http://localhost:5000/api/addresses/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{"latitude": 12.9716, "longitude": 77.5946}'
```

3. Test address search:
```bash
curl "http://localhost:5000/api/addresses/search?query=Koramangala&limit=3"
```

4. Test address suggestions:
```bash
curl "http://localhost:5000/api/addresses/suggestions?query=Indiranagar&limit=5"
```

## Frontend Testing

### Test 1: Build Frontend

```bash
npm run build
```

Expected: Build should complete successfully without errors.

### Test 2: Run Development Server

```bash
npm run dev
```

### Test 3: Manual Testing of Movers & Packers Flow

1. **Navigate to Movers & Packers Page**
   - Go to the homepage
   - Click on "Movers & Packers" service

2. **Test Address Autocomplete**
   - Start typing in the "Pickup Location" field
   - Verify that suggestions appear after 3 characters
   - Select a suggestion
   - Verify the full address is displayed below

3. **Test "Select on Map" Feature**
   
   For Pickup Location:
   - Click "Select on Map" button
   - Verify map modal opens with a default view
   - Try these actions:
     - **Search**: Type an address in the search box and select from results
     - **Current Location**: Click the location button (top-right) to use GPS
     - **Click on Map**: Click anywhere on the map to place a marker
     - **Navigation**: Use zoom controls and drag to navigate
   - Click "Confirm Location"
   - Verify the address appears in the pickup location field

   For Drop Location:
   - Repeat the same steps for "Drop Location"

4. **Test Complete Booking Flow**
   - Select home size (e.g., 2BHK)
   - Choose pickup and drop locations using map
   - Select moving date
   - Add vehicle shifting (optional)
   - Add painting services (optional)
   - Verify price quote updates automatically
   - Fill contact information
   - Click "Book Now"
   - Verify booking is created successfully

### Test 4: Test Error Handling

1. **Without Mapbox Token**
   - Remove `VITE_MAPBOX_ACCESS_TOKEN` from .env
   - Restart dev server
   - Click "Select on Map"
   - Verify error message appears: "Mapbox Not Configured"

2. **With Invalid Token**
   - Set an invalid token in .env
   - Try to use map features
   - Verify system falls back to Nominatim for address search

## Visual Testing Checklist

- [ ] Map loads correctly with street view
- [ ] Marker appears when clicking on map
- [ ] Marker animates (bounces) when placed
- [ ] Search results dropdown displays correctly
- [ ] Selected address shows full details
- [ ] Current location button works
- [ ] Map controls (zoom, navigation) are functional
- [ ] Modal can be closed with X button or Cancel
- [ ] Confirm button is disabled until location is selected
- [ ] Location data is correctly passed back to form

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Testing

1. **Load Time**
   - Map should load within 2-3 seconds on good connection
   - First marker placement should be instant

2. **Search Performance**
   - Suggestions should appear within 500ms of typing
   - Debouncing should prevent excessive API calls

3. **Memory Usage**
   - Open/close map picker multiple times
   - Check for memory leaks in browser dev tools

## Common Issues & Solutions

### Issue 1: Map Not Loading
**Solution**: 
- Verify `VITE_MAPBOX_ACCESS_TOKEN` is set correctly
- Check browser console for errors
- Ensure token has proper permissions

### Issue 2: "403 Forbidden" Errors
**Solution**:
- Token may be restricted to certain URLs
- Create a new unrestricted token for development

### Issue 3: Geocoding Not Working
**Solution**:
- Verify `MAPBOX_ACCESS_TOKEN` in backend .env
- Check backend server logs
- Test backend endpoints directly

### Issue 4: Slow Search Results
**Solution**:
- This is normal on free tier
- Consider upgrading Mapbox plan for production
- System will fall back to Nominatim if Mapbox fails

## Production Testing

Before deploying to production:

1. **Use Production Tokens**
   - Create separate tokens for production
   - Restrict tokens to production domain
   
2. **Test with Rate Limits**
   - Verify behavior when hitting API limits
   - Ensure fallback to Nominatim works

3. **Load Testing**
   - Test with multiple concurrent users
   - Monitor API usage on Mapbox dashboard

4. **Security Testing**
   - Verify tokens are not exposed in client-side code
   - Check network requests don't leak sensitive data
   - Ensure environment variables are secure

## Success Criteria

✓ All backend tests pass
✓ Frontend builds without errors
✓ Map loads and displays correctly
✓ Address search returns relevant results
✓ Map clicking places marker correctly
✓ Reverse geocoding shows accurate addresses
✓ Current location detection works
✓ Booking can be created with map-selected locations
✓ No security vulnerabilities detected
✓ Fallback to Nominatim works when Mapbox unavailable

## Support

For issues or questions:
- Check MAPBOX_INTEGRATION.md for setup details
- Review Mapbox documentation: https://docs.mapbox.com/
- Check server logs for backend errors
- Check browser console for frontend errors
