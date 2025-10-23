const API = import.meta.env.VITE_API_URL || window.location.origin;

/**
 * Movers & Packers API Client
 */
export const moversAPI = {
  // Bookings
  createBooking: async (bookingData) => {
    const response = await fetch(`${API}/api/movers/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  verifyPayment: async (bookingId, paymentData) => {
    const response = await fetch(`${API}/api/movers/booking/${bookingId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  getBooking: async (bookingId) => {
    const response = await fetch(`${API}/api/movers/booking/${bookingId}`);
    return response.json();
  },

  getBookingsByPhone: async (phone) => {
    const response = await fetch(`${API}/api/movers/booking/phone/${phone}`);
    return response.json();
  },

  // Admin
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API}/api/movers/booking/admin/all?${params}`, {
      credentials: 'include'
    });
    return response.json();
  },

  updateBookingStatus: async (bookingId, statusData) => {
    const response = await fetch(`${API}/api/movers/booking/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(statusData)
    });
    return response.json();
  }
};
