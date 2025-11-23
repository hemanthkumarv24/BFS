import moversPackersRoutes from './routes/moversPackers.js';

// Simple test server to display beautiful service information
const express = (await import('express')).default;
const app = express();
app.use(express.json());

app.use('/api/movers-packers', moversPackersRoutes);

const PORT = 3334;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const printHeader = (text) => {
  const width = 80;
  const padding = Math.floor((width - text.length - 2) / 2);
  const line = '═'.repeat(width);
  console.log(`\n${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.cyan}${' '.repeat(padding)}${colors.bright}${colors.yellow}${text}${colors.reset}${colors.cyan}${' '.repeat(padding)}${colors.reset}`);
  console.log(`${colors.cyan}${line}${colors.reset}\n`);
};

const printServiceCard = (service, index) => {
  console.log(`${colors.bright}${colors.blue}╔${'═'.repeat(78)}╗${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║${colors.reset} ${service.icon} ${colors.bright}${colors.green}${index}. ${service.name}${colors.reset}${' '.repeat(78 - service.name.length - index.toString().length - 7)}${colors.bright}${colors.blue}║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║${colors.reset}    ${colors.dim}${service.subtitle}${colors.reset}${' '.repeat(74 - service.subtitle.length)}${colors.bright}${colors.blue}║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}╠${'═'.repeat(78)}╣${colors.reset}`);
  
  // Price
  console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.bright}${colors.magenta}💰 Base Price:${colors.reset} ${colors.bright}${colors.yellow}${formatCurrency(service.basePrice)}${colors.reset} (${service.distanceRange})${' '.repeat(78 - formatCurrency(service.basePrice).length - service.distanceRange.length - 17)}${colors.bright}${colors.blue}║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║${' '.repeat(78)}║${colors.reset}`);
  
  // Includes
  console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.bright}${colors.green}✔ Includes:${colors.reset}${' '.repeat(64)}${colors.bright}${colors.blue}║${colors.reset}`);
  service.includes.forEach(item => {
    const line = `   • ${item}`;
    console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.green}${line}${colors.reset}${' '.repeat(77 - line.length)}${colors.bright}${colors.blue}║${colors.reset}`);
  });
  console.log(`${colors.bright}${colors.blue}║${' '.repeat(78)}║${colors.reset}`);
  
  // Not Includes
  console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.bright}${colors.red}❌ Not Includes:${colors.reset}${' '.repeat(60)}${colors.bright}${colors.blue}║${colors.reset}`);
  service.notIncludes.forEach(item => {
    const line = `   • ${item}`;
    console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.red}${line}${colors.reset}${' '.repeat(77 - line.length)}${colors.bright}${colors.blue}║${colors.reset}`);
  });
  console.log(`${colors.bright}${colors.blue}║${' '.repeat(78)}║${colors.reset}`);
  
  // Process
  console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.bright}${colors.cyan}⭐ How It's Done:${colors.reset}${' '.repeat(59)}${colors.bright}${colors.blue}║${colors.reset}`);
  service.process.forEach(step => {
    const line = `   ${step.step}. ${step.action} → ${step.description}`;
    const displayLine = line.length > 75 ? line.substring(0, 72) + '...' : line;
    console.log(`${colors.bright}${colors.blue}║${colors.reset} ${colors.cyan}${displayLine}${colors.reset}${' '.repeat(77 - displayLine.length)}${colors.bright}${colors.blue}║${colors.reset}`);
  });
  
  console.log(`${colors.bright}${colors.blue}╚${'═'.repeat(78)}╝${colors.reset}\n`);
};

const printDistancePricing = (distancePricing) => {
  console.log(`${colors.bright}${colors.magenta}╔${'═'.repeat(78)}╗${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}║${colors.reset} 🛣️  ${colors.bright}${colors.yellow}DISTANCE CHARGES (ALL ITEMS)${colors.reset}${' '.repeat(43)}${colors.bright}${colors.magenta}║${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}╠${'═'.repeat(78)}╣${colors.reset}`);
  
  distancePricing.forEach(tier => {
    const priceDisplay = tier.chargeType === 'per_km' 
      ? `₹${tier.charge}/km` 
      : tier.charge === 0 
        ? 'Included' 
        : `+${formatCurrency(tier.charge)}`;
    const line = `${tier.range.padEnd(15)} → ${priceDisplay}`;
    console.log(`${colors.bright}${colors.magenta}║${colors.reset} ${colors.yellow}${line}${colors.reset}${' '.repeat(77 - line.length)}${colors.bright}${colors.magenta}║${colors.reset}`);
  });
  
  console.log(`${colors.bright}${colors.magenta}╚${'═'.repeat(78)}╝${colors.reset}\n`);
};

const printPriceExample = () => {
  console.log(`${colors.bright}${colors.green}╔${'═'.repeat(78)}╗${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset} 💡 ${colors.bright}${colors.white}PRICE CALCULATION EXAMPLES${colors.reset}${' '.repeat(46)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}╠${'═'.repeat(78)}╣${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset} ${colors.white}Example 1: Bike shifting - 3 km${colors.reset}${' '.repeat(43)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset}   Base: ₹1,299 + Distance: ₹0 = ${colors.bright}${colors.yellow}Total: ₹1,299${colors.reset}${' '.repeat(27)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${' '.repeat(78)}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset} ${colors.white}Example 2: Fridge shifting - 8 km${colors.reset}${' '.repeat(41)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset}   Base: ₹1,899 + Distance: ₹150 = ${colors.bright}${colors.yellow}Total: ₹2,049${colors.reset}${' '.repeat(25)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${' '.repeat(78)}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset} ${colors.white}Example 3: Sofa shifting - 15 km${colors.reset}${' '.repeat(42)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset}   Base: ₹2,299 + Distance: ₹250 = ${colors.bright}${colors.yellow}Total: ₹2,549${colors.reset}${' '.repeat(25)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${' '.repeat(78)}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset} ${colors.white}Example 4: Table shifting - 35 km${colors.reset}${' '.repeat(42)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}║${colors.reset}   Base: ₹799 + Distance: ₹50 (₹10/km × 5km) = ${colors.bright}${colors.yellow}Total: ₹849${colors.reset}${' '.repeat(14)}${colors.bright}${colors.green}║${colors.reset}`);
  console.log(`${colors.bright}${colors.green}╚${'═'.repeat(78)}╝${colors.reset}\n`);
};

app.listen(PORT, async () => {
  try {
    const response = await fetch(`http://localhost:${PORT}/api/movers-packers`);
    const data = await response.json();
    
    console.clear();
    printHeader('🚚 BFS FULL ITEM SHIFTING SERVICES 🚚');
    
    console.log(`${colors.bright}${colors.cyan}📦 ${data.category}${colors.reset}`);
    console.log(`${colors.dim}${data.description}${colors.reset}`);
    console.log(`${colors.dim}Service Area: ${data.serviceArea} | Availability: ${data.availability}${colors.reset}`);
    console.log(`${colors.dim}Total Services: ${data.totalServices}${colors.reset}\n`);
    
    // Print all services
    data.services.forEach((service, index) => {
      printServiceCard(service, index + 1);
    });
    
    // Print distance pricing
    printDistancePricing(data.distancePricing);
    
    // Print examples
    printPriceExample();
    
    // Footer
    console.log(`${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}`);
    console.log(`${colors.bright}${colors.yellow}   📞 Contact Us | 🌐 Visit Website | 📱 Download App${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}\n`);
    
    console.log(`${colors.bright}${colors.green}✨ All service details are beautifully displayed above!${colors.reset}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});
