import express from 'express';
import moversPackersRoutes from './routes/moversPackers.js';

const app = express();
app.use(express.json());
app.use('/api/movers-packers', moversPackersRoutes);

const PORT = 3336;

app.listen(PORT, async () => {
  console.log('🧪 Testing zero distance validation...\n');
  
  try {
    const response = await fetch(`http://localhost:${PORT}/api/movers-packers/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'bike-shifting', distance: 0 })
    });
    const data = await response.json();
    
    if (!data.success && data.message.includes('greater than 0')) {
      console.log('✅ Zero distance validation works!');
      console.log(`   Message: "${data.message}"\n`);
    } else {
      console.log('❌ Failed: Zero distance should be rejected\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
});
