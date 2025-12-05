import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = (showMessage = false) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (showMessage) {
      toast.error('Session expired. Please login again.');
    }
  };

  const updateAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await getProfile(storedToken);
        if (response && !response.error && response.success !== false) {
          setUser(response);
          localStorage.setItem('user', JSON.stringify(response));
          return true;
        } else {
          // Token is invalid or expired
          logout(true);
          return false;
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // If it's a 401 error, logout
        if (error.message?.includes('401') || error.message?.includes('token')) {
          logout(true);
          return false;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        try {
          // First, use stored user data for immediate display if available
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
          setToken(storedToken);
          
          // Then fetch fresh data from server to validate token
          const response = await getProfile(storedToken);
          if (response && !response.error && response.success !== false) {
            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
          } else {
            // If token is invalid, logout without showing message on initial load
            console.log('Token validation failed during initialization');
            logout(false);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Check if it's a 401 error (invalid/expired token)
          const errorMsg = error.message?.toLowerCase() || '';
          if (errorMsg.includes('401') || errorMsg.includes('unauthorized') || errorMsg.includes('token')) {
            console.log('Token expired or invalid during initialization');
            logout(false);
          } else if (storedUser) {
            // Network error - keep cached user data
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              logout(false);
            }
          }
        }
      }
      
      setLoading(false);
    }
    
    initializeAuth();
  }, []); // Only run once on mount

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, logout, updateAuth, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
