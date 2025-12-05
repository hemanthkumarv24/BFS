/**
 * API Interceptor Utility
 * Handles API calls with automatic token validation and error handling
 */

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
 * Create a wrapper for fetch that handles authentication errors
 * This can be used as a drop-in replacement for fetch in API calls
 */
export function createAuthenticatedFetch(onUnauthorized) {
  return async function(url, options = {}) {
    return authenticatedFetch(url, options, onUnauthorized);
  };
}
