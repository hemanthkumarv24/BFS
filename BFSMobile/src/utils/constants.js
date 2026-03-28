export const SERVICE_CATEGORIES = [
  {
    id: 'car-wash',
    name: 'Car Wash',
    icon: 'car-wash',
    color: '#0A1F44',
    bgColor: '#E8EEF8',
  },
  {
    id: 'bike-wash',
    name: 'Bike Wash',
    icon: 'motorbike',
    color: '#00D4FF',
    bgColor: '#E0FAFF',
  },
  {
    id: 'helmet-wash',
    name: 'Helmet Wash',
    icon: 'hard-hat',
    color: '#FF7A00',
    bgColor: '#FFF0E5',
  },
  {
    id: 'vehicle-checkup',
    name: 'Vehicle Check-up',
    icon: 'car-search',
    color: '#0A1F44',
    bgColor: '#E8EEF8',
    screen: 'VehicleCheckup',
  },
  {
    id: 'puc',
    name: 'PUC Certificate',
    icon: 'file-certificate',
    color: '#10B981',
    bgColor: '#E6F9F4',
    screen: 'PUC',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'shield-check',
    color: '#8B5CF6',
    bgColor: '#F0EBFF',
    screen: 'Insurance',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'shopping',
    color: '#F59E0B',
    bgColor: '#FEF9EC',
    screen: 'Accessories',
  },
  {
    id: 'autofix',
    name: 'AutoFix Pro',
    icon: 'wrench',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    screen: 'AutoFix',
  },
];

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export const VEHICLE_TYPES = [
  {id: 'hatchback', label: 'Hatchback'},
  {id: 'sedan', label: 'Sedan'},
  {id: 'suv', label: 'SUV'},
  {id: 'bike', label: 'Bike'},
  {id: 'scooty', label: 'Scooty'},
];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BANNERS = [
  {
    id: 1,
    title: 'Premium Car Wash',
    subtitle: 'Starting at ₹299',
    gradient: ['#0A1F44', '#1A4080'],
    tag: '20% OFF',
  },
  {
    id: 2,
    title: 'Bike Cleaning',
    subtitle: 'Deep clean & polish',
    gradient: ['#00D4FF', '#0090B0'],
    tag: 'Popular',
  },
  {
    id: 3,
    title: 'PUC Certificate',
    subtitle: 'Quick & Hassle-free',
    gradient: ['#FF7A00', '#CC5500'],
    tag: 'Fast',
  },
];

export const POPULAR_SERVICES = [
  {
    id: 's1',
    name: 'Premium Car Wash',
    category: 'Car Wash',
    price: 499,
    rating: 4.8,
    reviews: 234,
    duration: '45 min',
    image: null,
  },
  {
    id: 's2',
    name: 'Bike Deep Clean',
    category: 'Bike Wash',
    price: 199,
    rating: 4.7,
    reviews: 189,
    duration: '30 min',
    image: null,
  },
  {
    id: 's3',
    name: 'Helmet Sanitize',
    category: 'Helmet Wash',
    price: 99,
    rating: 4.6,
    reviews: 121,
    duration: '20 min',
    image: null,
  },
  {
    id: 's4',
    name: 'PUC Certificate',
    category: 'PUC',
    price: 149,
    rating: 4.9,
    reviews: 567,
    duration: '15 min',
    image: null,
  },
];

export const ACCESSORIES_DATA = [
  {id: 'a1', name: 'Car Body Cover (Silver)', category: 'Car Covers', price: 799, rating: 4.5, reviews: 89, emoji: '🚗'},
  {id: 'a2', name: 'Bike Cover (Waterproof)', category: 'Bike Covers', price: 349, rating: 4.3, reviews: 56, emoji: '🏍️'},
  {id: 'a3', name: 'Car Seat Covers (Leatherette)', category: 'Seat Covers', price: 1999, rating: 4.7, reviews: 123, emoji: '💺'},
  {id: 'a4', name: 'Dashboard Camera', category: 'Electronics', price: 2499, rating: 4.6, reviews: 78, emoji: '📹'},
  {id: 'a5', name: 'Car Air Freshener (Pack of 3)', category: 'Accessories', price: 199, rating: 4.4, reviews: 234, emoji: '🌸'},
  {id: 'a6', name: 'Microfiber Cleaning Cloth Set', category: 'Cleaners', price: 299, rating: 4.8, reviews: 456, emoji: '🧽'},
  {id: 'a7', name: 'Tyre Pressure Gauge', category: 'Accessories', price: 149, rating: 4.2, reviews: 67, emoji: '🔧'},
  {id: 'a8', name: 'Car Phone Mount (Magnetic)', category: 'Electronics', price: 399, rating: 4.5, reviews: 189, emoji: '📱'},
  {id: 'a9', name: 'Bike Helmet (Full Face)', category: 'Safety', price: 1499, rating: 4.6, reviews: 92, emoji: '⛑️'},
  {id: 'a10', name: 'Car Interior LED Lights', category: 'Lights', price: 599, rating: 4.3, reviews: 45, emoji: '💡'},
  {id: 'a11', name: 'Windshield Sunshade', category: 'Accessories', price: 349, rating: 4.4, reviews: 112, emoji: '☀️'},
  {id: 'a12', name: 'Car Wash Foam Kit', category: 'Cleaners', price: 499, rating: 4.7, reviews: 78, emoji: '��'},
];

export const AUTOFIX_SERVICES = [
  {
    id: 'denting',
    name: 'Denting',
    price: 799,
    description: 'Removal of dents and dings from car body',
    emoji: '🔨',
    includes: ['Dent removal', 'Surface leveling', 'Minor filling', 'Quality check'],
  },
  {
    id: 'painting',
    name: 'Painting',
    price: 1999,
    description: 'Professional car painting & touch-up service',
    emoji: '🎨',
    includes: ['Color matching', 'Surface prep', 'Painting', 'Clear coat', '30-day warranty'],
  },
  {
    id: 'polishing',
    name: 'Full Polish',
    price: 599,
    description: 'Deep polishing to restore car shine',
    emoji: '✨',
    includes: ['Clay bar treatment', 'Machine polish', 'Wax coat', 'Tyre dressing', 'Mirror finish'],
  },
];

export const CONTACT_INFO = {
  supportEmail: 'support@bubbleflashservices.in',
  supportPhone: '1800-123-4567',
  whatsapp: '+91-9876543210',
};
