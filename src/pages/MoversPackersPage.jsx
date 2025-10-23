import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { 
  Truck, 
  Home, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail,
  ChevronRight, 
  Shield, 
  Star, 
  Clock,
  Package,
  Car,
  Bike,
  Paintbrush,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { moversAPI } from '../api/movers';
import toast from 'react-hot-toast';

// Home size options
const HOME_SIZES = [
  { value: '1bhk', label: '1 BHK', basePrice: { withinCity: 3999, intercity: 8999 } },
  { value: '2bhk', label: '2 BHK', basePrice: { withinCity: 5999, intercity: 12999 } },
  { value: '3bhk', label: '3 BHK', basePrice: { withinCity: 8999, intercity: 17999 } },
  { value: '4bhk', label: '4 BHK', basePrice: { withinCity: 11999, intercity: 22999 } },
  { value: 'villa', label: 'Villa', basePrice: { withinCity: 15999, intercity: 29999 } }
];

// Vehicle shifting options
const VEHICLE_TYPES = [
  { value: 'bike', label: 'Bike', charge: 1500 },
  { value: 'car', label: 'Car', charge: 3000 },
  { value: 'both', label: 'Both (Bike & Car)', charge: 4000 }
];

// Painting services
const PAINTING_SERVICES = [
  { value: 'interior', label: 'Interior Painting', charge: 5000 },
  { value: 'exterior', label: 'Exterior Painting', charge: 7000 },
  { value: 'wood', label: 'Wood Painting', charge: 3000 }
];

export default function MoversPackersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [moveType, setMoveType] = useState('within-city');
  const [homeSize, setHomeSize] = useState('');
  const [sourceAddress, setSourceAddress] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [movingDate, setMovingDate] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  
  // Vehicle shifting
  const [vehicleShifting, setVehicleShifting] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  
  // Painting services
  const [paintingServices, setPaintingServices] = useState({
    interior: false,
    exterior: false,
    wood: false
  });
  
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(0);

  // Update form when user logs in
  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserPhone(user.phone || '');
      setUserEmail(user.email || '');
    }
  }, [user]);

  // Calculate estimated distance
  useEffect(() => {
    if (sourceCoords && destinationCoords) {
      const distance = calculateDistance(
        sourceCoords.latitude,
        sourceCoords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude
      );
      setEstimatedDistance(distance);
    }
  }, [sourceCoords, destinationCoords]);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!homeSize) return 0;

    const homeSizeData = HOME_SIZES.find(h => h.value === homeSize);
    const basePrice = moveType === 'within-city' 
      ? homeSizeData.basePrice.withinCity 
      : homeSizeData.basePrice.intercity;

    let vehicleCharge = 0;
    if (vehicleShifting && vehicleType) {
      const vehicle = VEHICLE_TYPES.find(v => v.value === vehicleType);
      vehicleCharge = vehicle?.charge || 0;
    }

    let paintingCharge = 0;
    if (paintingServices.interior) paintingCharge += 5000;
    if (paintingServices.exterior) paintingCharge += 7000;
    if (paintingServices.wood) paintingCharge += 3000;

    let distanceCharge = 0;
    if (moveType === 'intercity' && estimatedDistance > 100) {
      distanceCharge = (estimatedDistance - 100) * 15;
    }

    return basePrice + vehicleCharge + paintingCharge + distanceCharge;
  };

  const handleSourceSelect = (addressData) => {
    setSourceCoords({
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      city: addressData.city,
      pincode: addressData.pincode
    });
  };

  const handleDestinationSelect = (addressData) => {
    setDestinationCoords({
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      city: addressData.city,
      pincode: addressData.pincode
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!moveType || !homeSize || !sourceAddress || !destinationAddress || !movingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!userName || !userPhone) {
      toast.error('Please provide your name and phone number');
      return;
    }

    if (vehicleShifting && !vehicleType) {
      toast.error('Please select vehicle type for shifting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        user: {
          name: userName,
          phone: userPhone,
          email: userEmail,
          userId: user?._id
        },
        moveType,
        homeSize,
        sourceAddress: {
          full: sourceAddress,
          lat: sourceCoords?.latitude,
          lng: sourceCoords?.longitude,
          pincode: sourceCoords?.pincode,
          city: sourceCoords?.city
        },
        destinationAddress: {
          full: destinationAddress,
          lat: destinationCoords?.latitude,
          lng: destinationCoords?.longitude,
          pincode: destinationCoords?.pincode,
          city: destinationCoords?.city
        },
        movingDate,
        distanceKm: estimatedDistance,
        vehicleShifting: {
          enabled: vehicleShifting,
          vehicleType: vehicleShifting ? vehicleType : null
        },
        paintingServices,
        notes
      };

      const result = await moversAPI.createBooking(bookingData);

      if (result.success) {
        toast.success('Booking created successfully!');
        
        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: result.data.razorpayOrder.amount,
          currency: result.data.razorpayOrder.currency,
          name: 'Bubble Flash Services',
          description: `Movers & Packers - ${homeSize.toUpperCase()}`,
          order_id: result.data.razorpayOrder.id,
          handler: async function (response) {
            try {
              const verifyResult = await moversAPI.verifyPayment(
                result.data.booking._id,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              );

              if (verifyResult.success) {
                toast.success('Payment successful! Your booking is confirmed.');
                navigate('/orders');
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error(result.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Movers & Packers
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional and reliable moving services for your home. 
            Book now for a hassle-free relocation experience!
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, title: 'Insured Moving', desc: 'Your belongings are safe' },
            { icon: Clock, title: 'On-Time Service', desc: 'Punctual and reliable' },
            { icon: Star, title: 'Expert Team', desc: 'Trained professionals' },
            { icon: Package, title: 'Quality Packing', desc: 'Premium materials' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md text-center"
            >
              <feature.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Move Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Move Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'within-city', label: 'Within City', icon: Home },
                  { value: 'intercity', label: 'Intercity', icon: Truck }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMoveType(type.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      moveType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                      moveType === type.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="font-semibold text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Home Size */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Home Size *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {HOME_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setHomeSize(size.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      homeSize === size.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{size.label}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      ₹{moveType === 'within-city' ? size.basePrice.withinCity : size.basePrice.intercity}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <MapPin className="inline w-5 h-5 mr-2" />
                  Source Address *
                </label>
                <AddressAutocomplete
                  value={sourceAddress}
                  onChange={setSourceAddress}
                  onSelect={handleSourceSelect}
                  placeholder="Enter pickup address"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <MapPin className="inline w-5 h-5 mr-2" />
                  Destination Address *
                </label>
                <AddressAutocomplete
                  value={destinationAddress}
                  onChange={setDestinationAddress}
                  onSelect={handleDestinationSelect}
                  placeholder="Enter destination address"
                  className="w-full"
                />
              </div>
            </div>

            {/* Distance Display */}
            {estimatedDistance > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Estimated Distance:</span>
                  <span className="font-semibold text-blue-700">{estimatedDistance} km</span>
                </div>
              </div>
            )}

            {/* Moving Date */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                <Calendar className="inline w-5 h-5 mr-2" />
                Moving Date *
              </label>
              <input
                type="date"
                value={movingDate}
                onChange={(e) => setMovingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Vehicle Shifting */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="vehicleShifting"
                  checked={vehicleShifting}
                  onChange={(e) => {
                    setVehicleShifting(e.target.checked);
                    if (!e.target.checked) setVehicleType('');
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="vehicleShifting" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  Add Vehicle Shifting
                </label>
              </div>

              <AnimatePresence>
                {vehicleShifting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                  >
                    {VEHICLE_TYPES.map((vehicle) => (
                      <button
                        key={vehicle.value}
                        type="button"
                        onClick={() => setVehicleType(vehicle.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          vehicleType === vehicle.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {vehicle.value === 'bike' && <Bike className="w-6 h-6 mx-auto mb-2 text-blue-600" />}
                        {vehicle.value === 'car' && <Car className="w-6 h-6 mx-auto mb-2 text-blue-600" />}
                        {vehicle.value === 'both' && <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />}
                        <div className="font-semibold text-gray-900">{vehicle.label}</div>
                        <div className="text-sm text-gray-600 mt-1">+₹{vehicle.charge}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Painting Services */}
            <div className="border-t pt-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Paintbrush className="inline w-5 h-5 mr-2" />
                Additional Painting Services
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAINTING_SERVICES.map((service) => (
                  <label
                    key={service.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paintingServices[service.value]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={paintingServices[service.value]}
                      onChange={(e) => setPaintingServices({
                        ...paintingServices,
                        [service.value]: e.target.checked
                      })}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{service.label}</div>
                        <div className="text-sm text-gray-600 mt-1">+₹{service.charge}</div>
                      </div>
                      {paintingServices[service.value] && (
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions or requirements..."
              />
            </div>

            {/* Price Summary */}
            {homeSize && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Price ({HOME_SIZES.find(h => h.value === homeSize)?.label}):</span>
                    <span className="font-semibold">
                      ₹{moveType === 'within-city' 
                        ? HOME_SIZES.find(h => h.value === homeSize)?.basePrice.withinCity 
                        : HOME_SIZES.find(h => h.value === homeSize)?.basePrice.intercity}
                    </span>
                  </div>
                  {vehicleShifting && vehicleType && (
                    <div className="flex justify-between text-gray-700">
                      <span>Vehicle Shifting ({VEHICLE_TYPES.find(v => v.value === vehicleType)?.label}):</span>
                      <span className="font-semibold">
                        +₹{VEHICLE_TYPES.find(v => v.value === vehicleType)?.charge}
                      </span>
                    </div>
                  )}
                  {paintingServices.interior && (
                    <div className="flex justify-between text-gray-700">
                      <span>Interior Painting:</span>
                      <span className="font-semibold">+₹5,000</span>
                    </div>
                  )}
                  {paintingServices.exterior && (
                    <div className="flex justify-between text-gray-700">
                      <span>Exterior Painting:</span>
                      <span className="font-semibold">+₹7,000</span>
                    </div>
                  )}
                  {paintingServices.wood && (
                    <div className="flex justify-between text-gray-700">
                      <span>Wood Painting:</span>
                      <span className="font-semibold">+₹3,000</span>
                    </div>
                  )}
                  {moveType === 'intercity' && estimatedDistance > 100 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Distance Charge ({estimatedDistance - 100} km × ₹15):</span>
                      <span className="font-semibold">+₹{(estimatedDistance - 100) * 15}</span>
                    </div>
                  )}
                </div>
                <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{calculateTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Book Now & Pay
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Info Note */}
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Final pricing may vary based on actual distance, 
                accessibility, and volume of items. Our team will confirm the exact amount before the move.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our Moving Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Professional Packing',
                description: 'We use high-quality packing materials and techniques to ensure your items are protected during transit.',
                icon: Package
              },
              {
                title: 'Experienced Team',
                description: 'Our trained professionals handle your belongings with care, ensuring safe and efficient relocation.',
                icon: Star
              },
              {
                title: 'Insurance Coverage',
                description: 'All moves are insured for your peace of mind. We take responsibility for your valuables.',
                icon: Shield
              },
              {
                title: 'On-Time Delivery',
                description: 'We value your time and ensure timely pickup and delivery as per the scheduled date.',
                icon: Clock
              },
              {
                title: 'Vehicle Options',
                description: 'Flexible vehicle shifting services for bikes and cars at competitive rates.',
                icon: Car
              },
              {
                title: 'Painting Services',
                description: 'Get your new home painted before moving in with our professional painting services.',
                icon: Paintbrush
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
