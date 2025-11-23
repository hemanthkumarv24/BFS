import express from 'express';
import moversPackersRoutes from './routes/moversPackers.js';

const app = express();
app.use(express.json());

// Register the movers-packers routes
app.use('/api/movers-packers', moversPackersRoutes);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/movers-packers`);
  console.log(`   GET  http://localhost:${PORT}/api/movers-packers/distance-pricing`);
  console.log(`   GET  http://localhost:${PORT}/api/movers-packers/category/vehicles`);
  console.log(`   GET  http://localhost:${PORT}/api/movers-packers/bike-shifting`);
  console.log(`   POST http://localhost:${PORT}/api/movers-packers/calculate-price`);
  console.log('\n🧪 Testing in 2 seconds...\n');
  
  setTimeout(async () => {
    try {
      // Test 1: Get all services
      console.log('🧪 Test 1: Get all services');
      const response1 = await fetch(`http://localhost:${PORT}/api/movers-packers`);
      const data1 = await response1.json();
      console.log(`✅ Success! Found ${data1.totalServices} services`);
      console.log(`   Services: ${data1.services.map(s => s.name).join(', ')}\n`);
      
      // Test 2: Get specific service
      console.log('🧪 Test 2: Get bike shifting service');
      const response2 = await fetch(`http://localhost:${PORT}/api/movers-packers/bike-shifting`);
      const data2 = await response2.json();
      console.log(`✅ Success! ${data2.service.name} - Base price: ₹${data2.service.basePrice}`);
      console.log(`   Includes: ${data2.service.includes.join(', ')}\n`);
      
      // Test 3: Calculate price
      console.log('🧪 Test 3: Calculate price for bike shifting at 15 km');
      const response3 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: 'bike-shifting', distance: 15 })
      });
      const data3 = await response3.json();
      console.log(`✅ Success! Total price: ₹${data3.pricing.totalPrice}`);
      console.log(`   Breakdown: Base ₹${data3.pricing.basePrice} + Distance charge ₹${data3.pricing.distanceCharge}\n`);
      
      // Test 4: Get category
      console.log('🧪 Test 4: Get vehicles category');
      const response4 = await fetch(`http://localhost:${PORT}/api/movers-packers/category/vehicles`);
      const data4 = await response4.json();
      console.log(`✅ Success! Found ${data4.count} vehicles services`);
      console.log(`   Services: ${data4.services.map(s => s.name).join(', ')}\n`);
      
      // Test 5: Get distance pricing
      console.log('🧪 Test 5: Get distance pricing');
      const response5 = await fetch(`http://localhost:${PORT}/api/movers-packers/distance-pricing`);
      const data5 = await response5.json();
      console.log(`✅ Success! Distance pricing tiers:`);
      data5.distancePricing.forEach(tier => {
        console.log(`   ${tier.range}: ${tier.description}`);
      });
      
      console.log('\n✨ All tests passed successfully!\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }, 2000);
});
