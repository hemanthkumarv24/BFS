import moversPackersRoutes from './routes/moversPackers.js';
import express from 'express';

const app = express();
app.use(express.json());
app.use('/api/movers-packers', moversPackersRoutes);

const PORT = 3337;

app.listen(PORT, async () => {
  console.log('🧪 Testing boundary conditions in detail...\n');
  
  const testCases = [
    { distance: 4.9, expected: 0, range: '0-5km' },
    { distance: 5, expected: 0, range: '0-5km (boundary)' },
    { distance: 5.0, expected: 0, range: '0-5km (exact)' },
    { distance: 5.01, expected: 150, range: '5-10km' },
    { distance: 10, expected: 150, range: '5-10km (boundary)' },
    { distance: 10.01, expected: 250, range: '10-20km' },
    { distance: 20, expected: 250, range: '10-20km (boundary)' },
    { distance: 20.01, expected: 350, range: '20-30km' },
    { distance: 30, expected: 350, range: '20-30km (boundary)' },
    { distance: 30.01, expected: 1, range: '30+ km' },
  ];
  
  for (const test of testCases) {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: 'bike-shifting', distance: test.distance })
      });
      const data = await response.json();
      const actual = data.pricing.distanceCharge;
      const status = actual === test.expected ? '✅' : '❌';
      console.log(`${status} ${test.distance}km (${test.range}): Expected ₹${test.expected}, Got ₹${actual}`);
    } catch (error) {
      console.log(`❌ ${test.distance}km: Error - ${error.message}`);
    }
  }
  
  process.exit(0);
});
