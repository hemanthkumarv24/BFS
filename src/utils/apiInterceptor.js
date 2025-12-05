/**
 * API Interceptor Utility
 * Handles API calls with automatic token validation and error handling
 */

const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

/**
 * Make an authenticated API call with automatic error handling
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @param {function} onUnauthorized - Callback when token is invalid/expired
 */
export async function authenticatedFetch(url, options = {}, onUnauthorized = null) {
  const token = localStorage.getItem('token');
  
  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Check if response is 401 (Unauthorized)
    if (response.status === 401) {
      // Token is invalid or expired
      console.log('Token expired or invalid, clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call the callback if provided
      if (onUnauthorized && typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
      
      // Throw error to be caught by caller
      throw new Error('Authentication required. Please login again.');
    }
    
    return response;
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Setup global fetch interceptor for handling 401 errors
 * This wraps the native fetch to automatically handle expired tokens
 */
export function setupApiInterceptor(onUnauthorized) {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // Check if this is an API call (starts with /api or includes API domain)
    const url = args[0];
    const isApiCall = typeof url === 'string' && (
      url.startsWith('/api') || 
      url.startsWith(`${API}/api`) ||
      url.includes('/api/')
    );
    
    // If it's an API call and returns 401, handle token expiration
    if (isApiCall && response.status === 401) {
      console.log('API returned 401, clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call the callback
      if (onUnauthorized && typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
    }
    
    return response;
  };
}
