import express from 'express';
import {
  getAllMoversPackersServices,
  getMoversPackersServiceById,
  calculateServicePrice,
  getServicesByCategory,
  getDistancePricing
} from '../controllers/moversPackersController.js';

const router = express.Router();

// Public routes - no authentication required

// GET /api/movers-packers - Get all movers and packers services
router.get('/', getAllMoversPackersServices);

// GET /api/movers-packers/distance-pricing - Get distance pricing information
router.get('/distance-pricing', getDistancePricing);

// GET /api/movers-packers/category/:categoryType - Get services by category (vehicles, appliances, furniture, all)
router.get('/category/:categoryType', getServicesByCategory);

// GET /api/movers-packers/:serviceId - Get a specific service by ID
router.get('/:serviceId', getMoversPackersServiceById);

// POST /api/movers-packers/calculate-price - Calculate price for a service based on distance
router.post('/calculate-price', calculateServicePrice);

export default router;
