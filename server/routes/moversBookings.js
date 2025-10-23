import express from 'express';
import {
  createMoversBooking,
  verifyMoversPayment,
  getMoversBooking,
  getMoversBookingsByPhone,
  updateMoversBookingStatus,
  getAllMoversBookings
} from '../controllers/moversBookingController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Public/User routes
router.post('/', createMoversBooking);
router.post('/:id/pay', verifyMoversPayment);
router.get('/:id', getMoversBooking);
router.get('/phone/:phone', getMoversBookingsByPhone);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAllMoversBookings);
router.put('/:id/status', authenticateAdmin, updateMoversBookingStatus);

export default router;
