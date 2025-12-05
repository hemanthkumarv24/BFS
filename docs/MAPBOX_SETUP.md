# Mapbox Integration Setup

This document explains how to set up and use the Mapbox integration for the Packers & Movers page.

## Overview

The Packers & Movers page now uses Mapbox for interactive location selection, providing users with:
- **Interactive Map**: Visual map interface to see and select locations
- **Drag & Drop**: Draggable pin marker for precise location selection
- **Search**: Address search with autocomplete suggestions
- **Click to Select**: Click anywhere on the map to set a location
- **Current Location**: Built-in button to automatically detect user's location
- **Reverse Geocoding**: Automatically converts coordinates to readable addresses

## Setup Instructions

### 1. Get a Mapbox Access Token

1. Visit [Mapbox Account](https://account.mapbox.com/)
2. Sign up for a free account (if you don't have one)
3. Go to your [Access Tokens](https://account.mapbox.com/access-tokens/) page
4. Create a new token or use the default public token
5. Copy your access token

**Security Note:** The token is exposed in client-side code. For production use:
- Use Mapbox's URL restrictions to limit token usage to your domain
- Consider implementing a backend proxy for API calls in high-traffic scenarios
- Monitor usage in your Mapbox dashboard and set up billing alerts

### 2. Configure Environment Variable

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your Mapbox access token:

```bash
VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
```

3. Replace `your_actual_mapbox_token_here` with your actual Mapbox token

### 3. Restart Development Server

After adding the token, restart your development server:

```bash
npm run dev
```

## Features

### For Users

- **Search Address**: Type in the search box to find locations with autocomplete suggestions
- **Select on Map**: Click anywhere on the map to set that as your location
- **Drag Pin**: Drag the red pin marker to adjust your exact location
- **Use Current Location**: Click the location button to automatically detect your position
- **See Distance**: The system automatically calculates distance between pickup and drop-off

### For Developers

The MapboxLocationPicker component provides:
- `value`: Current address string
- `onChange`: Callback when address text changes
- `onSelect`: Callback when location is selected (receives full address data with coordinates)
- `placeholder`: Customizable placeholder text
- `initialCoords`: Optional initial coordinates to display
- `className`: Custom CSS classes

## Mapbox Free Tier

Mapbox offers a generous free tier:
- **50,000 map loads** per month
- **100,000 geocoding requests** per month

This should be more than enough for most applications. Monitor your usage in the [Mapbox Dashboard](https://account.mapbox.com/).

## Troubleshooting

### Map Not Showing

1. Check if `VITE_MAPBOX_ACCESS_TOKEN` is set in your `.env` file
2. Verify the token is valid in your Mapbox account
3. Check browser console for error messages
4. Ensure you've restarted the dev server after adding the token

### Location Detection Not Working

1. Ensure you're using HTTPS (required for geolocation API)
2. Check browser permissions for location access
3. Some browsers block location access in development mode

### Search Not Working

1. Verify your Mapbox token has geocoding permissions
2. Check your monthly API usage limits
3. Ensure you have an internet connection

## API Documentation

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL Documentation](https://visgl.github.io/react-map-gl/)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)

## Migration Notes

### Removed Components

- **AddressAutocomplete**: Replaced with MapboxLocationPicker
- **Current Location Button**: Now integrated into the map's GeolocateControl

### Benefits Over Previous Implementation

1. **Visual Feedback**: Users can see exactly where they're selecting
2. **Precision**: Drag-and-drop allows pixel-perfect location selection
3. **Better UX**: Interactive map is more intuitive than text-only input
4. **Reliable**: Mapbox is a industry-standard mapping solution
5. **Feature Rich**: Built-in navigation, zoom, and location controls

## Cost Considerations

While Mapbox has a generous free tier, be aware of the pricing structure:
- Track usage in your Mapbox dashboard
- Set up billing alerts in Mapbox account settings
- Consider caching commonly requested locations
- Implement rate limiting if needed

For most use cases, you'll stay well within the free tier limits.
