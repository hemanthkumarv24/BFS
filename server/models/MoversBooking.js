import mongoose from 'mongoose';

const moversBookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      maxlength: 15
    },
    email: {
      type: String,
      maxlength: 100
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  moveType: {
    type: String,
    enum: ['within-city', 'intercity'],
    required: true
  },
  homeSize: {
    type: String,
    enum: ['1bhk', '2bhk', '3bhk', '4bhk', 'villa'],
    required: true
  },
  sourceAddress: {
    full: {
      type: String,
      required: true,
      maxlength: 500
    },
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    },
    pincode: {
      type: String,
      maxlength: 10
    },
    city: {
      type: String
    }
  },
  destinationAddress: {
    full: {
      type: String,
      required: true,
      maxlength: 500
    },
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    },
    pincode: {
      type: String,
      maxlength: 10
    },
    city: {
      type: String
    }
  },
  movingDate: {
    type: Date,
    required: true
  },
  distanceKm: {
    type: Number,
    min: 0
  },
  vehicleShifting: {
    enabled: {
      type: Boolean,
      default: false
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'both'],
      default: null
    },
    additionalCharge: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  paintingServices: {
    interior: {
      type: Boolean,
      default: false
    },
    exterior: {
      type: Boolean,
      default: false
    },
    wood: {
      type: Boolean,
      default: false
    },
    additionalCharge: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    vehicleCharge: {
      type: Number,
      min: 0,
      default: 0
    },
    paintingCharge: {
      type: Number,
      min: 0,
      default: 0
    },
    distanceCharge: {
      type: Number,
      min: 0,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['created', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'created',
    index: true
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'cod', 'upi', 'razorpay', 'cash'], // Support both old and new values
      default: 'online'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paidAmount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for faster queries
moversBookingSchema.index({ status: 1, createdAt: -1 });
moversBookingSchema.index({ 'user.phone': 1 });
moversBookingSchema.index({ movingDate: 1 });
moversBookingSchema.index({ moveType: 1 });

export default mongoose.model('MoversBooking', moversBookingSchema);
