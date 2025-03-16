import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRoute component
 * Protects routes that require authentication
 * If user is not authenticated, redirects to login page with return URL
 * 
 * @param {Object} props
 * @param {string} props.allowedRoles - Optional comma-separated list of roles allowed to access the route (e.g., "admin,donor")
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If allowedRoles is specified, check if user has required role
  if (allowedRoles && user) {
    const roles = allowedRoles.split(',').map(role => role.trim());
    
    // For admin-only routes
    if (roles.includes('admin') && !user.isAdmin) {
      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
    
    // For donor-only routes
    if (roles.includes('donor') && user.userType !== 'donor') {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // For recipient-only routes
    if (roles.includes('recipient') && user.userType !== 'recipient') {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // User is authenticated and has required role, render the child routes
  return <Outlet />;
};

export default PrivateRoute; 