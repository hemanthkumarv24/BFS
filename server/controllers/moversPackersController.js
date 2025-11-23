// Controller for Movers & Packers services - Category B
// BFS FULL ITEM SHIFTING SERVICES (Local Bangalore)

// Distance pricing calculator
const calculateDistanceCharge = (distance) => {
  if (distance <= 5) return 0;
  if (distance <= 10) return 150;
  if (distance <= 20) return 250;
  if (distance <= 30) return 350;
  return Math.ceil((distance - 30) * 10);
};

// Calculate total price based on base price and distance
const calculateTotalPrice = (basePrice, distance) => {
  const distanceCharge = calculateDistanceCharge(distance);
  return basePrice + distanceCharge;
};

// All movers and packers services data
const moversPackersServices = [
  {
    id: 'bike-shifting',
    name: 'BIKE SHIFTING',
    icon: '🏍️',
    emoji: '🏍️',
    category: 'Category B',
    subtitle: 'Local Bangalore',
    basePrice: 1299,
    distanceRange: '0-5 km',
    image: '/bike-shifting.png',
    includes: [
      'Foam sheet packing',
      'Bubble wrap',
      'Tank & handle protection',
      'Rope lock inside vehicle',
      'Loading + transport + unloading'
    ],
    notIncludes: [
      'Bike repair',
      'Fuel refill',
      'Mechanical issues'
    ],
    process: [
      { step: 1, action: 'Wrap', description: 'Complete foam and bubble wrap protection' },
      { step: 2, action: 'Load', description: 'Carefully load into vehicle' },
      { step: 3, action: 'Tie', description: 'Secure with rope locks' },
      { step: 4, action: 'Transport', description: 'Safe transportation' },
      { step: 5, action: 'Unload', description: 'Unload at destination' },
      { step: 6, action: 'Handover', description: 'Final handover to customer' }
    ],
    features: [
      'Professional foam sheet packing',
      'High-quality bubble wrap protection',
      'Tank and handle special protection',
      'Secure rope locking system',
      'Complete loading and unloading service'
    ],
    sortOrder: 1
  },
  {
    id: 'scooty-shifting',
    name: 'SCOOTY SHIFTING',
    icon: '🛵',
    emoji: '🛵',
    category: 'Category B',
    subtitle: 'Local Bangalore',
    basePrice: 1199,
    distanceRange: '0-5 km',
    image: '/scooty-shifting.png',
    includes: [
      'Full wrap packing',
      'Side panel protection',
      'Loading + unloading',
      'Mini-truck transport'
    ],
    notIncludes: [
      'Dent removal',
      'Electrical issues'
    ],
    process: [
      { step: 1, action: 'Pad', description: 'Apply protective padding' },
      { step: 2, action: 'Load', description: 'Load into mini-truck' },
      { step: 3, action: 'Tie', description: 'Secure with straps' },
      { step: 4, action: 'Deliver', description: 'Safe delivery to destination' }
    ],
    features: [
      'Complete wrap packing',
      'Side panel special protection',
      'Professional loading and unloading',
      'Dedicated mini-truck transport'
    ],
    sortOrder: 2
  },
  {
    id: 'fridge-shifting',
    name: 'FRIDGE SHIFTING',
    icon: '🧊',
    emoji: '🧊',
    category: 'Category B',
    subtitle: 'Single/Double Door',
    basePrice: 1899,
    distanceRange: '0-5 km',
    image: '/fridge-shifting.png',
    includes: [
      'Bubble + stretch wrap',
      'Upright transport only',
      '2-3 helpers',
      'Placement in kitchen'
    ],
    notIncludes: [
      'Gas refill',
      'Cooling repair'
    ],
    process: [
      { step: 1, action: 'Wrap', description: 'Bubble and stretch wrap protection' },
      { step: 2, action: 'Carry', description: 'Carry with 2-3 helpers' },
      { step: 3, action: 'Load', description: 'Load upright in vehicle' },
      { step: 4, action: 'Transport', description: 'Upright transportation' },
      { step: 5, action: 'Place', description: 'Proper placement in kitchen' }
    ],
    features: [
      'Bubble wrap and stretch wrap protection',
      'Upright transport to prevent damage',
      '2-3 professional helpers',
      'Proper kitchen placement'
    ],
    sortOrder: 3
  },
  {
    id: 'washing-machine-shifting',
    name: 'WASHING MACHINE SHIFTING',
    icon: '🧼',
    emoji: '🧼',
    category: 'Category B',
    subtitle: 'All Types',
    basePrice: 1299,
    distanceRange: '0-5 km',
    image: '/washing-machine-shifting.png',
    includes: [
      'Foam wrap',
      'Drum lock',
      'Transport',
      'Loading + unloading'
    ],
    notIncludes: [
      'Pipe installation',
      'Machine repair'
    ],
    process: [
      { step: 1, action: 'Secure', description: 'Lock the drum' },
      { step: 2, action: 'Wrap', description: 'Foam wrap protection' },
      { step: 3, action: 'Load', description: 'Load into vehicle' },
      { step: 4, action: 'Transport', description: 'Safe transportation' },
      { step: 5, action: 'Unload', description: 'Unload at destination' }
    ],
    features: [
      'Professional foam wrap',
      'Drum locking for safety',
      'Secure transport',
      'Complete loading and unloading'
    ],
    sortOrder: 4
  },
  {
    id: 'sofa-shifting',
    name: 'SOFA SHIFTING',
    icon: '🛋️',
    emoji: '🛋️',
    category: 'Category B',
    subtitle: '3-5 Seater',
    basePrice: 2299,
    distanceRange: '0-5 km',
    image: '/sofa-shifting.png',
    includes: [
      'Bubble wrap + foam',
      'Corner protection',
      'Manual lifting',
      'Door-to-door transport'
    ],
    notIncludes: [
      'Sofa repair',
      'Dismantling (extra)'
    ],
    process: [
      { step: 1, action: 'Wrap', description: 'Bubble wrap and foam protection' },
      { step: 2, action: 'Protect', description: 'Corner protection applied' },
      { step: 3, action: 'Lift', description: 'Careful manual lifting' },
      { step: 4, action: 'Load', description: 'Load into vehicle' },
      { step: 5, action: 'Deliver', description: 'Door-to-door delivery' }
    ],
    features: [
      'Bubble wrap and foam protection',
      'Special corner protection',
      'Professional manual lifting',
      'Complete door-to-door service'
    ],
    sortOrder: 5
  },
  {
    id: 'tv-shifting',
    name: 'TV SHIFTING',
    icon: '📺',
    emoji: '📺',
    category: 'Category B',
    subtitle: 'LED/Smart TV',
    basePrice: 899,
    distanceRange: '0-5 km',
    image: '/tv-shifting.png',
    includes: [
      'Bubble wrap',
      'Screen protection sheet',
      'Cardboard frame',
      'Transport'
    ],
    notIncludes: [
      'Wall mounting',
      'Screen replacement'
    ],
    process: [
      { step: 1, action: 'Wrap', description: 'TV wrapped like a sandwich panel' },
      { step: 2, action: 'Cardboard', description: 'Cardboard edges protection' },
      { step: 3, action: 'Load', description: 'Load carefully' },
      { step: 4, action: 'Deliver', description: 'Safe delivery' }
    ],
    features: [
      'Professional bubble wrap',
      'Screen protection sheet',
      'Cardboard frame protection',
      'Secure transport'
    ],
    sortOrder: 6
  },
  {
    id: 'mattress-shifting',
    name: 'MATTRESS SHIFTING',
    icon: '🛏',
    emoji: '🛏️',
    category: 'Category B',
    subtitle: 'Single/Double/Queen/King',
    basePrice: 699,
    distanceRange: '0-5 km',
    image: '/mattress-shifting.png',
    includes: [
      'Mattress cover / plastic wrap',
      'Transport',
      'Loading + unloading'
    ],
    notIncludes: [
      'Mattress cleaning',
      'Mold treatment'
    ],
    process: [
      { step: 1, action: 'Cover', description: 'Apply protective cover' },
      { step: 2, action: 'Carry', description: 'Roll or flat carry' },
      { step: 3, action: 'Transport', description: 'Safe transportation' },
      { step: 4, action: 'Deliver', description: 'Deliver to destination' }
    ],
    features: [
      'Protective mattress cover or plastic wrap',
      'Flexible transport method',
      'Complete loading and unloading'
    ],
    sortOrder: 7
  },
  {
    id: 'cupboard-shifting',
    name: 'CUPBOARD SHIFTING',
    icon: '🚪',
    emoji: '🚪',
    category: 'Category B',
    subtitle: 'Steel/Wooden',
    basePrice: 1499,
    distanceRange: '0-5 km',
    image: '/cupboard-shifting.png',
    includes: [
      'Full wrap',
      'Shelf taping',
      'Lifting & loading',
      'Transport',
      'Unloading'
    ],
    notIncludes: [
      'Inside item packing',
      'Door repair'
    ],
    process: [
      { step: 1, action: 'Empty', description: 'Empty the cupboard' },
      { step: 2, action: 'Wrap', description: 'Full wrap protection' },
      { step: 3, action: 'Tie', description: 'Secure with taping' },
      { step: 4, action: 'Load', description: 'Load into vehicle' },
      { step: 5, action: 'Deliver', description: 'Deliver safely' }
    ],
    features: [
      'Complete full wrap protection',
      'Shelf taping for security',
      'Professional lifting and loading',
      'Secure transport and unloading'
    ],
    sortOrder: 8
  },
  {
    id: 'table-shifting',
    name: 'TABLE SHIFTING',
    icon: '🪑',
    emoji: '🪑',
    category: 'Category B',
    subtitle: 'Office / Dining / Study',
    basePrice: 799,
    distanceRange: '0-5 km',
    image: '/table-shifting.png',
    includes: [
      'Table wrap',
      'Edge protection',
      'Transport',
      'Loading + unloading'
    ],
    notIncludes: [
      'Table repair',
      'Disassembling (extra)'
    ],
    process: [
      { step: 1, action: 'Wrap', description: 'Wrap the table' },
      { step: 2, action: 'Lift', description: 'Professional lifting' },
      { step: 3, action: 'Load', description: 'Load into vehicle' },
      { step: 4, action: 'Transport', description: 'Safe transportation' },
      { step: 5, action: 'Unload', description: 'Careful unloading' }
    ],
    features: [
      'Professional table wrap',
      'Edge protection',
      'Secure transport',
      'Complete loading and unloading'
    ],
    sortOrder: 9
  }
];

// Distance pricing tiers
const distancePricing = [
  {
    range: '0-5 km',
    minKm: 0,
    maxKm: 5,
    charge: 0,
    description: 'Base price includes 0-5 km'
  },
  {
    range: '5-10 km',
    minKm: 5,
    maxKm: 10,
    charge: 150,
    description: 'Additional ₹150 for 5-10 km'
  },
  {
    range: '10-20 km',
    minKm: 10,
    maxKm: 20,
    charge: 250,
    description: 'Additional ₹250 for 10-20 km'
  },
  {
    range: '20-30 km',
    minKm: 20,
    maxKm: 30,
    charge: 350,
    description: 'Additional ₹350 for 20-30 km'
  },
  {
    range: '30+ km',
    minKm: 30,
    maxKm: null,
    charge: 10,
    chargeType: 'per_km',
    description: '₹10 per km after 30 km'
  }
];

/**
 * Get all movers and packers services
 * @route GET /api/movers-packers
 */
export const getAllMoversPackersServices = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'BFS FULL ITEM SHIFTING SERVICES (Local Bangalore)',
      category: 'Category B - All Items',
      description: 'Professional moving and packing services for bikes, scooties, furniture, and appliances',
      totalServices: moversPackersServices.length,
      services: moversPackersServices,
      distancePricing: distancePricing,
      serviceArea: 'Bangalore',
      availability: '7 Days a Week'
    });
  } catch (error) {
    console.error('Error fetching movers packers services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

/**
 * Get a specific service by ID
 * @route GET /api/movers-packers/:serviceId
 */
export const getMoversPackersServiceById = (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = moversPackersServices.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service: service,
      distancePricing: distancePricing,
      serviceArea: 'Bangalore'
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

/**
 * Calculate price for a service based on distance
 * @route POST /api/movers-packers/calculate-price
 * @body { serviceId: string, distance: number }
 */
export const calculateServicePrice = (req, res) => {
  try {
    const { serviceId, distance } = req.body;

    if (!serviceId || distance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Service ID and distance are required'
      });
    }

    const service = moversPackersServices.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const distanceCharge = calculateDistanceCharge(distance);
    const totalPrice = calculateTotalPrice(service.basePrice, distance);

    res.status(200).json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        icon: service.icon
      },
      pricing: {
        basePrice: service.basePrice,
        distanceCharge: distanceCharge,
        totalPrice: totalPrice,
        distance: distance,
        currency: '₹'
      },
      breakdown: {
        basePrice: `₹${service.basePrice} (0-5 km included)`,
        distanceCharge: distance <= 5 ? 'Included' : `₹${distanceCharge}`,
        total: `₹${totalPrice}`
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating price',
      error: error.message
    });
  }
};

/**
 * Get services by category (filter by item type)
 * @route GET /api/movers-packers/category/:categoryType
 */
export const getServicesByCategory = (req, res) => {
  try {
    const { categoryType } = req.params;
    
    // Define category mappings
    const categories = {
      'vehicles': ['bike-shifting', 'scooty-shifting'],
      'appliances': ['fridge-shifting', 'washing-machine-shifting', 'tv-shifting'],
      'furniture': ['sofa-shifting', 'mattress-shifting', 'cupboard-shifting', 'table-shifting'],
      'all': null // return all services
    };

    let filteredServices;
    
    if (categoryType === 'all' || !categories[categoryType]) {
      filteredServices = moversPackersServices;
    } else {
      const categoryIds = categories[categoryType];
      filteredServices = moversPackersServices.filter(s => categoryIds.includes(s.id));
    }

    res.status(200).json({
      success: true,
      category: categoryType,
      count: filteredServices.length,
      services: filteredServices,
      distancePricing: distancePricing
    });
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

/**
 * Get distance pricing information
 * @route GET /api/movers-packers/distance-pricing
 */
export const getDistancePricing = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Distance charges for all items',
      note: 'All prices are in addition to base price after 5 km',
      distancePricing: distancePricing,
      examples: [
        {
          distance: '7 km',
          calculation: 'Base Price + ₹150',
          range: '5-10 km'
        },
        {
          distance: '15 km',
          calculation: 'Base Price + ₹250',
          range: '10-20 km'
        },
        {
          distance: '25 km',
          calculation: 'Base Price + ₹350',
          range: '20-30 km'
        },
        {
          distance: '35 km',
          calculation: 'Base Price + ₹10/km (₹50 for 5 km beyond 30)',
          range: '30+ km'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching distance pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching distance pricing',
      error: error.message
    });
  }
};
