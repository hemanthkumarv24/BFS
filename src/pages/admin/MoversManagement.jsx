import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Filter,
  Search,
  ChevronDown,
  Edit
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const MoversManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMoveType, setFilterMoveType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, [filterStatus, filterMoveType]);

  const fetchBookings = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterMoveType !== 'all') params.append('moveType', filterMoveType);

      const response = await fetch(`${API}/api/movers/booking/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/employees`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAssignEmployee = async (bookingId, employeeId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/movers/booking/${bookingId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ employeeId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Employee assigned successfully');
        fetchBookings();
        setShowAssignModal(false);
      } else {
        toast.error(data.message || 'Failed to assign employee');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      toast.error('Error assigning employee');
    }
  };

  const handleUpdateStatus = async (bookingId, status, adminNotes = '') => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/movers/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        fetchBookings();
        setShowStatusModal(false);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      created: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Truck },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.created;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    const methodLabels = {
      online: 'Online Payment',
      cod: 'Cash on Delivery',
      upi: 'UPI'
    };

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <div className="text-sm">
        <div className="font-medium">{methodLabels[payment.method] || payment.method}</div>
        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${statusColors[payment.status]}`}>
          {payment.status.toUpperCase()}
        </span>
      </div>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.bookingNumber.toLowerCase().includes(searchLower) ||
      booking.user.name.toLowerCase().includes(searchLower) ||
      booking.user.phone.includes(searchTerm)
    );
  });

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600" />
              Movers & Packers Management
            </h1>
            <p className="text-gray-600 mt-1">Manage moving bookings and assign employees</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by booking number, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="created">Created</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Move Type Filter */}
            <select
              value={filterMoveType}
              onChange={(e) => setFilterMoveType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Move Types</option>
              <option value="within-city">Within City</option>
              <option value="intercity">Intercity</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.bookingNumber}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.movingDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {booking.user.phone}
                          </div>
                          {booking.user.email && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {booking.user.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">{booking.homeSize.toUpperCase()}</div>
                          <div className="text-gray-500">{booking.moveType === 'within-city' ? 'Within City' : 'Intercity'}</div>
                          <div className="text-gray-500">{booking.distanceKm} km</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentBadge(booking.payment)}
                        <div className="font-bold text-gray-900 mt-1">
                          ₹{booking.pricing.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4">
                        {booking.assignedEmployee ? (
                          <div className="text-sm">
                            <div className="font-medium">{booking.assignedEmployee.name}</div>
                            <div className="text-gray-500">{booking.assignedEmployee.phone}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowStatusModal(true);
                            }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assign Employee Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Assign Employee</h3>
              <p className="text-gray-600 mb-4">
                Booking: {selectedBooking.bookingNumber}
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {employees.map((employee) => (
                  <button
                    key={employee._id}
                    onClick={() => handleAssignEmployee(selectedBooking._id, employee._id)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.phone}</div>
                    {employee.specialization && (
                      <div className="text-xs text-gray-400 mt-1">{employee.specialization}</div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Update Status</h3>
              <p className="text-gray-600 mb-4">
                Booking: {selectedBooking.bookingNumber}
              </p>
              <div className="space-y-2">
                {['confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedBooking._id, status)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MoversManagement;
