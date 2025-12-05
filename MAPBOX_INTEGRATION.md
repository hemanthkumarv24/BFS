# Mapbox Integration for Movers & Packers

This document describes the Mapbox integration for enhanced location services in the Movers & Packers booking flow.

## Features

### Frontend
1. **Interactive Map Selection**: Users can select pickup and drop locations by clicking directly on a map
2. **Address Search with Autocomplete**: Real-time address suggestions as users type
3. **Current Location Detection**: Get user's current location with one click
4. **Visual Location Display**: Map markers and location preview

### Backend
1. **Mapbox Geocoding API**: Forward geocoding for address search
2. **Mapbox Reverse Geocoding**: Convert coordinates to addresses
3. **Fallback Support**: Falls back to OpenStreetMap Nominatim if Mapbox is unavailable
4. **Address Validation**: Extracts city, state, and pincode information

## Setup Instructions

### 1. Get Mapbox Access Token

1. Sign up at [https://account.mapbox.com/](https://account.mapbox.com/)
2. Navigate to Access Tokens page
3. Create a new token or use the default public token
4. Copy the access token

### 2. Configure Environment Variables

#### Backend (.env file in /server directory)
```env
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

#### Frontend (.env file in root directory)
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

### 3. Install Dependencies

Dependencies have already been installed:

**Frontend**:
- `mapbox-gl`: Mapbox GL JS library
- `react-map-gl`: React wrapper for Mapbox GL JS
- `@mapbox/mapbox-gl-geocoder`: Geocoding control

**Backend**:
- `@mapbox/mapbox-sdk`: Mapbox SDK for Node.js

## Components Added/Modified

### New Components

1. **MapboxLocationPicker** (`src/components/MapboxLocationPicker.jsx`)
   - Interactive map for location selection
   - Address search with live results
   - Current location support
   - Marker placement and address preview

### Modified Components

1. **MoversPackersPage** (`src/pages/MoversPackersPage.jsx`)
   - Added "Select on Map" buttons for pickup and drop locations
   - Integrated MapboxLocationPicker modals
   - Updated labels from "Source/Destination Address" to "Pickup/Drop Location"

2. **AddressService** (`server/services/addressService.js`)
   - Added Mapbox geocoding integration
   - Mapbox is now the primary provider, with fallback to OpenCage and Nominatim

## Usage

### For Users

1. **Enter Address Manually**: Type in the address field for autocomplete suggestions
2. **Select on Map**: 
   - Click "Select on Map" button
   - Search for a location or use current location
   - Click anywhere on the map to place a marker
   - Confirm the selected location

### For Developers

#### Using MapboxLocationPicker Component

```jsx
import MapboxLocationPicker from '../components/MapboxLocationPicker';

<MapboxLocationPicker
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onLocationSelect={(location) => {
    // location contains: fullAddress, latitude, longitude, city, state, pincode
    console.log(location);
  }}
  initialLocation={previousLocation}
  title="Select Location"
/>
```

## API Endpoints

The following backend endpoints support Mapbox:

- `POST /api/addresses/reverse-geocode`: Convert coordinates to address
- `GET /api/addresses/search`: Search for addresses
- `GET /api/addresses/suggestions`: Get address autocomplete suggestions

## Pricing & Limits

Mapbox offers a generous free tier:
- 100,000 free geocoding requests per month
- 50,000 free map loads per month

Refer to [Mapbox Pricing](https://www.mapbox.com/pricing/) for current rates.

## Troubleshooting

### Map not loading
- Verify VITE_MAPBOX_ACCESS_TOKEN is set correctly
- Check browser console for errors
- Ensure token has proper permissions

### Geocoding not working
- Verify MAPBOX_ACCESS_TOKEN in backend .env
- Check backend server logs for errors
- Ensure internet connectivity

### Fallback behavior
If Mapbox is unavailable or not configured, the system will automatically fall back to:
1. OpenCage Data API (if OPENCAGE_API_KEY is set)
2. OpenStreetMap Nominatim (free, rate-limited)

## Security Notes

- Never commit .env files with actual tokens to version control
- Keep access tokens secure and rotate them periodically
- Use separate tokens for development and production
- Restrict token permissions to only what's needed

## Additional Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [React Map GL Documentation](https://visgl.github.io/react-map-gl/)
