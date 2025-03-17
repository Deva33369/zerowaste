import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Validate token by checking expiration
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            // Set auth header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch user profile
            const res = await axios.get('/api/users/me');
            setUser(res.data);
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post('/api/users/register', userData);
      
      // Set token in local storage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post('/api/users/login', { email, password });
      
      // Set token in local storage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const res = await axios.put('/api/users/profile', userData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!token;

  // Check if user is a donor
  const isDonor = () => user?.userType === 'donor';

  // Check if user is a recipient
  const isRecipient = () => user?.userType === 'recipient';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated,
        isDonor,
        isRecipient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 