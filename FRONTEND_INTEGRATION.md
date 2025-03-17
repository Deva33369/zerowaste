# Frontend Integration Plan for ZeroWaste API

This document outlines the steps needed to integrate the ZeroWaste API with the React frontend application.

## 1. Setup API Client

First, we need to set up an API client to communicate with our backend. We'll use Axios for this.

### Create API Service

Create a new file `client/src/services/api.js`:

```javascript
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (possibly expired token)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 2. Create Service Modules

Create individual service modules for each resource type:

### User Service

Create `client/src/services/userService.js`:

```javascript
import api from './api';

export const login = (email, password) => {
  return api.post('/users/login', { email, password });
};

export const register = (userData) => {
  return api.post('/users/register', userData);
};

export const getCurrentUser = () => {
  return api.get('/users/me');
};

export const updateProfile = (userData) => {
  return api.put('/users/me', userData);
};

export default {
  login,
  register,
  getCurrentUser,
  updateProfile,
};
```

### Waste Item Service

Create `client/src/services/wasteItemService.js`:

```javascript
import api from './api';

export const getWasteItems = (params) => {
  return api.get('/waste-items', { params });
};

export const getWasteItemById = (id) => {
  return api.get(`/waste-items/${id}`);
};

export const createWasteItem = (itemData) => {
  return api.post('/waste-items', itemData);
};

export const updateWasteItem = (id, itemData) => {
  return api.put(`/waste-items/${id}`, itemData);
};

export const deleteWasteItem = (id) => {
  return api.delete(`/waste-items/${id}`);
};

export const getUserWasteItems = () => {
  return api.get('/waste-items/user/items');
};

export const getNearbyWasteItems = (distance) => {
  return api.get('/waste-items/nearby/items', { 
    params: { distance } 
  });
};

export default {
  getWasteItems,
  getWasteItemById,
  createWasteItem,
  updateWasteItem,
  deleteWasteItem,
  getUserWasteItems,
  getNearbyWasteItems,
};
```

### Request Service

Create `client/src/services/requestService.js`:

```javascript
import api from './api';

export const createRequest = (requestData) => {
  return api.post('/requests', requestData);
};

export const getUserRequests = (params) => {
  return api.get('/requests', { params });
};

export const getRequestById = (id) => {
  return api.get(`/requests/${id}`);
};

export const updateRequestStatus = (id, statusData) => {
  return api.put(`/requests/${id}`, statusData);
};

export const cancelRequest = (id, reason) => {
  return api.put(`/requests/${id}/cancel`, { reason });
};

export const getRequestStats = () => {
  return api.get('/requests/stats');
};

export default {
  createRequest,
  getUserRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  getRequestStats,
};
```

### Category Service

Create `client/src/services/categoryService.js`:

```javascript
import api from './api';

export const getCategories = () => {
  return api.get('/categories');
};

export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

export const getCategoryStats = () => {
  return api.get('/categories/stats');
};

// Admin-only operations
export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

export const updateCategory = (id, categoryData) => {
  return api.put(`/categories/${id}`, categoryData);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

export default {
  getCategories,
  getCategoryById,
  getCategoryStats,
  createCategory,
  updateCategory,
  deleteCategory,
};
```

### Upload Service

Create `client/src/services/uploadService.js`:

```javascript
import api from './api';

// For single image upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// For multiple image upload
export const uploadMultipleImages = (files) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  return api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete an uploaded image
export const deleteImage = (filename) => {
  return api.delete(`/upload/${filename}`);
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
```

## 3. Update AuthContext

Update the existing AuthContext to use our new services:

Modify `client/src/context/AuthContext.js`:

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import userService from '../services/userService';

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
            // Fetch user profile
            const res = await userService.getCurrentUser();
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
      const res = await userService.register(userData);
      
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
      const res = await userService.login(email, password);
      
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
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const res = await userService.updateProfile(userData);
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

  // Check if user is an admin
  const isAdmin = () => user?.isAdmin === true;

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
        isRecipient,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

## 4. Create New Components and Pages

### Update the App.js Routes

Modify `client/src/App.js` to include the new routes:

```javascript
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WasteItemListingPage from "./pages/WasteItemListingPage";
import WasteItemDetailPage from "./pages/WasteItemDetailPage";
import CreateWasteItemPage from "./pages/CreateWasteItemPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import RequestsPage from "./pages/RequestsPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Guards
import PrivateRoute from "./components/guards/PrivateRoute";
import AdminRoute from "./components/guards/AdminRoute";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color for eco-friendly theme
    },
    secondary: {
      main: "#ff9800", // Orange for secondary actions
    },
    background: {
      default: "#f8f9fa",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 120px)", paddingBottom: "2rem" }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                <Route path="/waste-items" element={<WasteItemListingPage />} />
                <Route path="/waste-items/:id" element={<WasteItemDetailPage />} />
                <Route 
                  path="/waste-items/create" 
                  element={
                    <PrivateRoute>
                      <CreateWasteItemPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/requests" 
                  element={
                    <PrivateRoute>
                      <RequestsPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/requests/:id" 
                  element={
                    <PrivateRoute>
                      <RequestDetailPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  } 
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
```

### Create Admin Route Guard

Create `client/src/components/guards/AdminRoute.js`:

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="calc(100vh - 120px)"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if not an admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected component
  return children;
};

export default AdminRoute;
```

## 5. Core Pages to Implement

### WasteItemListingPage

Create `client/src/pages/WasteItemListingPage.js` (similar to the existing FoodListingPage but updated for waste items)

### WasteItemDetailPage

Create `client/src/pages/WasteItemDetailPage.js` for viewing waste item details and creating requests

### CreateWasteItemPage

Create `client/src/pages/CreateWasteItemPage.js` for creating new waste items

### RequestsPage

Create `client/src/pages/RequestsPage.js` for viewing all user's requests

### RequestDetailPage

Create `client/src/pages/RequestDetailPage.js` for viewing and managing a specific request

### AdminDashboardPage

Create `client/src/pages/AdminDashboardPage.js` for admin functions like category management

## 6. Next Steps

1. Create or modify the necessary components and pages listed above
2. Update the existing components to reference our new API services
3. Test the integration between the frontend and backend
4. Add error handling and loading states
5. Implement image upload functionality using the Upload Service
6. Add geolocation features for nearby waste items 