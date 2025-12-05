// Test script for Mapbox integration
import addressService from './services/addressService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testMapboxIntegration() {
  console.log('Testing Mapbox Integration...\n');
  
  // Test 1: Reverse Geocoding
  console.log('Test 1: Reverse Geocoding');
  console.log('Testing coordinates: 12.9716, 77.5946 (Bangalore)');
  const reverseResult = await addressService.reverseGeocode(12.9716, 77.5946);
  console.log('Result:', JSON.stringify(reverseResult, null, 2));
  console.log('\n---\n');
  
  // Test 2: Address Search
  console.log('Test 2: Address Search');
  console.log('Searching for: "Koramangala, Bangalore"');
  const searchResult = await addressService.searchAddresses('Koramangala, Bangalore', 3);
  console.log('Result:', JSON.stringify(searchResult, null, 2));
  console.log('\n---\n');
  
  // Test 3: Address Suggestions
  console.log('Test 3: Address Suggestions');
  console.log('Getting suggestions for: "Indiranagar"');
  const suggestionsResult = await addressService.getAddressSuggestions('Indiranagar', 3);
  console.log('Result:', JSON.stringify(suggestionsResult, null, 2));
  console.log('\n---\n');
  
  // Summary
  console.log('\n=== Test Summary ===');
  console.log('Reverse Geocoding:', reverseResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('Address Search:', searchResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('Address Suggestions:', suggestionsResult.success ? '✓ PASS' : '✗ FAIL');
  
  if (reverseResult.success && searchResult.success && suggestionsResult.success) {
    console.log('\n✓ All tests passed! Mapbox integration is working correctly.');
  } else {
    console.log('\n⚠ Some tests failed. Check the results above for details.');
    console.log('\nNote: If MAPBOX_ACCESS_TOKEN is not set, the service will fall back to other providers.');
  }
}

testMapboxIntegration().catch(console.error);
