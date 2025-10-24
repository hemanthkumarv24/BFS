import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MapPin, Truck, Calendar, Phone, Mail, Home, Package, CheckCircle, XCircle, AlertCircle, Clock, User, RefreshCw, ChevronDown } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const MoversPackersAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moveTypeFilter, setMoveTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch bookings
  const fetchBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API}/api/admin/movers-packers/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setBookings(result.data.bookings);
        setFilteredBookings(result.data.bookings);
      } else {
        toast.error(result.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API}/api/admin/movers-packers/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Move type filter
    if (moveTypeFilter !== 'all') {
      filtered = filtered.filter(b => b.moveType === moveTypeFilter);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.contactPhone?.toLowerCase().includes(searchLower) ||
        b.contactEmail?.toLowerCase().includes(searchLower) ||
        b.sourceCity?.fullAddress?.toLowerCase().includes(searchLower) ||
        b.destinationCity?.fullAddress?.toLowerCase().includes(searchLower) ||
        b.userId?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, moveTypeFilter, searchTerm]);

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API}/api/admin/movers-packers/booking/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Status updated successfully');
        fetchBookings(true);
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`${API}/api/admin/movers-packers/booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Booking deleted successfully');
        fetchBookings(true);
        setShowDetailModal(false);
      } else {
        toast.error(result.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      'in-progress': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-7 h-7 text-blue-600" />
                Movers & Packers Bookings
              </h1>
              <p className="text-gray-600 mt-1">Manage moving and packing service bookings</p>
            </div>
            <button
              onClick={() => fetchBookings(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <Package className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</p>
                </div>
                <Calendar className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.byStatus?.find(s => s._id === 'pending')?.count || 0}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.byStatus?.find(s => s._id === 'completed')?.count || 0}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by phone, email, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Move Type Filter */}
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={moveTypeFilter}
                onChange={(e) => setMoveTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Move Types</option>
                <option value="within-city">Within City</option>
                <option value="intercity">Intercity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Move Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No bookings found</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking._id?.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {booking.contactPhone}
                            </div>
                            {booking.contactEmail && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {booking.contactEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 font-medium text-gray-900">
                            <Home className="w-4 h-4" />
                            {booking.homeSize}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {booking.moveType?.replace('-', ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs max-w-xs">
                          <div className="flex items-start gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 line-clamp-1">
                              {booking.sourceCity?.fullAddress || booking.sourceCity?.city}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 line-clamp-1">
                              {booking.destinationCity?.fullAddress || booking.destinationCity?.city}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.movingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{booking.estimatedPrice?.totalPrice?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedBooking.userId?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedBooking.contactPhone}</span>
                    </div>
                    {selectedBooking.contactEmail && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedBooking.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Move Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Move Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Move Type:</span>
                      <span className="ml-2 font-medium capitalize">{selectedBooking.moveType?.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Home Size:</span>
                      <span className="ml-2 font-medium">{selectedBooking.homeSize}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Moving Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedBooking.movingDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2">{getStatusBadge(selectedBooking.status)}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Addresses
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-700">Source:</span>
                      </div>
                      <p className="ml-6 text-gray-600">{selectedBooking.sourceCity?.fullAddress}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-gray-700">Destination:</span>
                      </div>
                      <p className="ml-6 text-gray-600">{selectedBooking.destinationCity?.fullAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Shifting */}
                {selectedBooking.vehicleShifting?.required && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Vehicle Shifting
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedBooking.vehicleShifting.vehicles?.map((vehicle, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-600">{vehicle.type}:</span>
                          <span className="font-medium">{vehicle.count} unit(s)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra Services */}
                {selectedBooking.extraServices?.painting?.required && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Painting Services</h3>
                    <div className="space-y-1 text-sm">
                      {selectedBooking.extraServices.painting.services?.interiorPainting && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Interior Painting</span>
                        </div>
                      )}
                      {selectedBooking.extraServices.painting.services?.exteriorPainting && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Exterior Painting</span>
                        </div>
                      )}
                      {selectedBooking.extraServices.painting.services?.woodPolishing && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Wood Polishing</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">₹{selectedBooking.estimatedPrice?.basePrice?.toLocaleString()}</span>
                    </div>
                    {selectedBooking.estimatedPrice?.vehicleShiftingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle Shifting:</span>
                        <span className="font-medium">₹{selectedBooking.estimatedPrice?.vehicleShiftingCost?.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedBooking.estimatedPrice?.paintingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Painting:</span>
                        <span className="font-medium">₹{selectedBooking.estimatedPrice?.paintingCost?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        ₹{selectedBooking.estimatedPrice?.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.customerNotes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Notes</h3>
                    <p className="text-sm text-gray-600">{selectedBooking.customerNotes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => updateBookingStatus(selectedBooking._id, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => deleteBooking(selectedBooking._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MoversPackersAdmin;
