import express from 'express';
import moversPackersRoutes from './routes/moversPackers.js';

const app = express();
app.use(express.json());

app.use('/api/movers-packers', moversPackersRoutes);

const PORT = 3335;

app.listen(PORT, async () => {
  console.log(`🧪 Running validation tests...\n`);
  
  try {
    // Test 1: Valid price calculation
    console.log('Test 1: Valid price calculation (15 km)');
    const response1 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: 15 })
    });
    const data1 = await response1.json();
    console.log(`✅ Success: ₹${data1.pricing.totalPrice}\n`);
    
    // Test 2: Negative distance (should fail)
    console.log('Test 2: Negative distance (should fail)');
    const response2 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: -5 })
    });
    const data2 = await response2.json();
    if (!data2.success && data2.message.includes('positive number')) {
      console.log(`✅ Validation works: ${data2.message}\n`);
    } else {
      console.log(`❌ Failed: Should reject negative distance\n`);
    }
    
    // Test 3: Invalid distance (string)
    console.log('Test 3: Invalid distance "abc" (should fail)');
    const response3 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: 'abc' })
    });
    const data3 = await response3.json();
    if (!data3.success && data3.message.includes('positive number')) {
      console.log(`✅ Validation works: ${data3.message}\n`);
    } else {
      console.log(`❌ Failed: Should reject invalid distance\n`);
    }
    
    // Test 4: Missing distance
    console.log('Test 4: Missing distance (should fail)');
    const response4 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting' })
    });
    const data4 = await response4.json();
    if (!data4.success && data4.message.includes('required')) {
      console.log(`✅ Validation works: ${data4.message}\n`);
    } else {
      console.log(`❌ Failed: Should reject missing distance\n`);
    }
    
    // Test 5: Edge case - exactly 5 km (should have no extra charge)
    console.log('Test 5: Edge case - exactly 5 km');
    const response5 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: 5 })
    });
    const data5 = await response5.json();
    if (data5.pricing.distanceCharge === 0) {
      console.log(`✅ Success: No extra charge at 5km (₹${data5.pricing.totalPrice})\n`);
    } else {
      console.log(`❌ Failed: Should have no extra charge at 5km\n`);
    }
    
    // Test 6: Edge case - 5.1 km (should charge for 5-10 km range)
    console.log('Test 6: Edge case - 5.1 km');
    const response6 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: 5.1 })
    });
    const data6 = await response6.json();
    if (data6.pricing.distanceCharge === 150) {
      console.log(`✅ Success: ₹150 charge for 5.1km (Total: ₹${data6.pricing.totalPrice})\n`);
    } else {
      console.log(`❌ Failed: Should charge ₹150 for 5.1km\n`);
    }
    
    // Test 7: 35 km calculation (30+ km range)
    console.log('Test 7: 35 km calculation (30+ km range)');
    const response7 = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'table-shifting', distance: 35 })
    });
    const data7 = await response7.json();
    const expectedCharge = (35 - 30) * 10; // Should be ₹50
    if (data7.pricing.distanceCharge === expectedCharge) {
      console.log(`✅ Success: ₹${expectedCharge} charge for 35km (Total: ₹${data7.pricing.totalPrice})\n`);
    } else {
      console.log(`❌ Failed: Should charge ₹${expectedCharge} for 35km, got ₹${data7.pricing.distanceCharge}\n`);
    }
    
    console.log('✨ All validation tests completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
});
