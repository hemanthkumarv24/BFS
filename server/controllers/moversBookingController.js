import MoversBooking from '../models/MoversBooking.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Status constants
const BOOKING_STATUS = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

const PAYMENT_METHOD = {
  ONLINE: 'online',
  COD: 'cod',
  UPI: 'upi'
};

// Generate booking number
const generateBookingNumber = () => {
  const prefix = 'MP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Calculate pricing based on home size, distance, and services
const calculatePricing = (homeSize, moveType, distanceKm, vehicleShifting, paintingServices) => {
  // Base prices for different home sizes
  const basePrices = {
    '1bhk': moveType === 'within-city' ? 3999 : 8999,
    '2bhk': moveType === 'within-city' ? 5999 : 12999,
    '3bhk': moveType === 'within-city' ? 8999 : 17999,
    '4bhk': moveType === 'within-city' ? 11999 : 22999,
    'villa': moveType === 'within-city' ? 15999 : 29999
  };

  const basePrice = basePrices[homeSize] || 3999;
  
  // Vehicle shifting charges
  let vehicleCharge = 0;
  if (vehicleShifting.enabled) {
    const vehicleCharges = {
      'bike': 1500,
      'car': 3000,
      'both': 4000
    };
    vehicleCharge = vehicleCharges[vehicleShifting.vehicleType] || 0;
  }

  // Painting service charges
  let paintingCharge = 0;
  if (paintingServices.interior) paintingCharge += 5000;
  if (paintingServices.exterior) paintingCharge += 7000;
  if (paintingServices.wood) paintingCharge += 3000;

  // Distance charge (for intercity moves beyond 100 km)
  let distanceCharge = 0;
  if (moveType === 'intercity' && distanceKm > 100) {
    distanceCharge = (distanceKm - 100) * 15; // ₹15 per km beyond 100 km
  }

  const totalAmount = basePrice + vehicleCharge + paintingCharge + distanceCharge;

  return {
    basePrice,
    vehicleCharge,
    paintingCharge,
    distanceCharge,
    totalAmount
  };
};

// Create a new movers booking
export const createMoversBooking = async (req, res) => {
  try {
    const {
      user,
      moveType,
      homeSize,
      sourceAddress,
      destinationAddress,
      movingDate,
      distanceKm,
      vehicleShifting,
      paintingServices,
      notes,
      paymentMethod // 'online', 'cod', or 'upi'
    } = req.body;

    // Validate required fields
    if (!user?.name || !user?.phone) {
      return res.status(400).json({
        success: false,
        message: 'User name and phone are required'
      });
    }

    if (!moveType || !homeSize || !sourceAddress || !destinationAddress || !movingDate) {
      return res.status(400).json({
        success: false,
        message: 'All booking details are required'
      });
    }

    // Validate payment method
    const validPaymentMethods = [PAYMENT_METHOD.ONLINE, PAYMENT_METHOD.COD, PAYMENT_METHOD.UPI];
    const selectedPaymentMethod = paymentMethod || PAYMENT_METHOD.ONLINE;
    if (!validPaymentMethods.includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Calculate pricing
    const pricing = calculatePricing(
      homeSize,
      moveType,
      distanceKm || 0,
      vehicleShifting || { enabled: false },
      paintingServices || { interior: false, exterior: false, wood: false }
    );

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Create booking
    const booking = new MoversBooking({
      bookingNumber,
      user,
      moveType,
      homeSize,
      sourceAddress,
      destinationAddress,
      movingDate,
      distanceKm: distanceKm || 0,
      vehicleShifting: {
        enabled: vehicleShifting?.enabled || false,
        vehicleType: vehicleShifting?.vehicleType || null,
        additionalCharge: pricing.vehicleCharge
      },
      paintingServices: {
        interior: paintingServices?.interior || false,
        exterior: paintingServices?.exterior || false,
        wood: paintingServices?.wood || false,
        additionalCharge: pricing.paintingCharge
      },
      pricing,
      notes,
      payment: {
        method: selectedPaymentMethod,
        status: PAYMENT_STATUS.PENDING
      },
      status: selectedPaymentMethod === PAYMENT_METHOD.COD ? BOOKING_STATUS.CONFIRMED : BOOKING_STATUS.CREATED
    });

    await booking.save();

    // If payment method is COD, skip Razorpay and return success
    if (selectedPaymentMethod === PAYMENT_METHOD.COD) {
      return res.status(201).json({
        success: true,
        message: 'Booking created successfully with Cash on Delivery',
        data: {
          booking,
          paymentMethod: 'cod'
        }
      });
    }

    // For online/UPI payment, create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(pricing.totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: bookingNumber,
      notes: {
        bookingNumber,
        moveType,
        homeSize
      }
    });

    // Update booking with Razorpay order ID
    booking.payment.razorpayOrderId = razorpayOrder.id;
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      }
    });
  } catch (error) {
    console.error('Create movers booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Verify payment for movers booking
export const verifyMoversPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Find booking
    const booking = await MoversBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update booking payment status
      booking.payment.razorpayPaymentId = razorpay_payment_id;
      booking.payment.status = PAYMENT_STATUS.PAID;
      booking.status = BOOKING_STATUS.CONFIRMED;
      await booking.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: booking
      });
    } else {
      booking.payment.status = PAYMENT_STATUS.FAILED;
      await booking.save();

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Verify movers payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get a single movers booking
export const getMoversBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await MoversBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get movers booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

// Get movers bookings by phone number
export const getMoversBookingsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const bookings = await MoversBooking.find({ 'user.phone': phone })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get movers bookings by phone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Update movers booking status (admin only)
export const updateMoversBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const booking = await MoversBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (adminNotes) {
      booking.adminNotes = adminNotes;
    }

    if (status === BOOKING_STATUS.COMPLETED) {
      booking.completedAt = new Date();
    } else if (status === BOOKING_STATUS.CANCELLED) {
      booking.cancelledAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update movers booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Assign employee to movers booking (admin only)
export const assignEmployeeToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const booking = await MoversBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.assignedEmployee = employeeId;
    await booking.save();

    // Populate employee details
    await booking.populate('assignedEmployee', 'name email phone specialization');

    res.json({
      success: true,
      message: 'Employee assigned successfully',
      data: booking
    });
  } catch (error) {
    console.error('Assign employee to booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign employee',
      error: error.message
    });
  }
};

// Get all movers bookings (admin only)
export const getAllMoversBookings = async (req, res) => {
  try {
    const { status, moveType, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (moveType) query.moveType = moveType;

    const bookings = await MoversBooking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await MoversBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all movers bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};
