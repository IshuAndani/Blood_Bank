// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

/**
 * Protected route component that checks if user is authenticated
 * @param {Object} props - Component props
 * @param {string|Array} props.allowedRoles - Roles that can access this route
 * @param {string} props.redirectTo - Where to redirect if not authenticated
 */
const ProtectedRoute = ({ 
  allowedRoles, 
  redirectTo = '/donor/login',
}) => {
  const { isAuthenticated, currentUser, hasRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles specified, check if user has required role
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;