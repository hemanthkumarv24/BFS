import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, X, Search, Loader } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxLocationPicker = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  initialLocation,
  title = "Select Location"
}) => {
  // Check if Mapbox token is configured
  if (!MAPBOX_TOKEN && isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mapbox Not Configured</h2>
            <p className="text-gray-600 mb-4">
              The Mapbox access token is not configured. Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#FFB400] text-white rounded-lg font-semibold hover:bg-[#e0a000]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const [viewState, setViewState] = useState({
    longitude: initialLocation?.longitude || 77.5946, // Bangalore default
    latitude: initialLocation?.latitude || 12.9716,
    zoom: 13
  });
  
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation ? {
      longitude: initialLocation.longitude,
      latitude: initialLocation.latitude
    } : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.fullAddress || '');
  
  const mapRef = useRef();
  const searchTimeoutRef = useRef();

  // Search for addresses using Mapbox Geocoding
  const searchAddresses = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=in&limit=5&autocomplete=true`
      );
      const data = await response.json();
      
      if (data.features) {
        setSearchResults(data.features);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (longitude, latitude) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];
        
        let city = '';
        let state = '';
        let pincode = '';
        
        context.forEach(item => {
          if (item.id.startsWith('place.')) {
            city = item.text;
          } else if (item.id.startsWith('region.')) {
            state = item.text;
          } else if (item.id.startsWith('postcode.')) {
            pincode = item.text;
          }
        });
        
        const address = {
          fullAddress: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
          city: city,
          state: state,
          pincode: pincode
        };
        
        setSelectedAddress(feature.place_name);
        return address;
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    } finally {
      setIsLoadingAddress(false);
    }
    return null;
  };

  // Handle map click
  const handleMapClick = async (event) => {
    const { lngLat } = event;
    setMarkerPosition({
      longitude: lngLat.lng,
      latitude: lngLat.lat
    });
    
    const address = await reverseGeocode(lngLat.lng, lngLat.lat);
    if (!address) {
      setSelectedAddress(`${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`);
    }
  };

  // Handle search result selection
  const handleSearchResultClick = (feature) => {
    const [longitude, latitude] = feature.center;
    
    setViewState({
      longitude,
      latitude,
      zoom: 15
    });
    
    setMarkerPosition({ longitude, latitude });
    setSelectedAddress(feature.place_name);
    setSearchQuery('');
    setSearchResults([]);
    
    // Extract city, state, pincode from context
    const context = feature.context || [];
    let city = '';
    let state = '';
    let pincode = '';
    
    context.forEach(item => {
      if (item.id.startsWith('place.')) {
        city = item.text;
      } else if (item.id.startsWith('region.')) {
        state = item.text;
      } else if (item.id.startsWith('postcode.')) {
        pincode = item.text;
      }
    });
  };

  // Handle confirm button
  const handleConfirm = () => {
    if (markerPosition) {
      const locationData = {
        fullAddress: selectedAddress,
        latitude: markerPosition.latitude,
        longitude: markerPosition.longitude
      };
      
      // Parse additional details from selectedAddress if available
      onLocationSelect(locationData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#FFB400]" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
            />
            {isSearching && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSearchResultClick(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-700">{result.place_name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-[400px]">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onClick={handleMapClick}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            {markerPosition && (
              <Marker
                longitude={markerPosition.longitude}
                latitude={markerPosition.latitude}
                anchor="bottom"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-[#FFB400] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Marker>
            )}
            
            <NavigationControl position="top-right" />
            <GeolocateControl
              position="top-right"
              trackUserLocation
              onGeolocate={(e) => {
                setMarkerPosition({
                  longitude: e.coords.longitude,
                  latitude: e.coords.latitude
                });
                reverseGeocode(e.coords.longitude, e.coords.latitude);
              }}
            />
          </Map>
        </div>

        {/* Selected Address Display */}
        {selectedAddress && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#FFB400] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Selected Location</div>
                <div className="text-gray-800">{selectedAddress}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!markerPosition || isLoadingAddress}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingAddress ? 'Loading...' : 'Confirm Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapboxLocationPicker;
