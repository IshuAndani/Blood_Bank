// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      const role = localStorage.getItem('role');
      
      if (token && id && role) {
        setCurrentUser({
          id,
          role,
          token,
          name: localStorage.getItem('name'),
          workplaceId: localStorage.getItem('workplaceId'),
          workplaceType: localStorage.getItem('workplaceType'),
          lastDonationDate: localStorage.getItem('lastDonationDate')
        });
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (endpoint, credentials) => {
    try {
      const res = await api.post(`/${endpoint}/login`, credentials);
      
      if (res.data.success) {
        // Clear any previous auth data
        localStorage.clear();
        
        // Store auth data
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('id', res.data.data[`${endpoint}Id`]);
        localStorage.setItem('role', endpoint === 'admin' ? res.data.data.role : 'donor');
        
        if (endpoint === 'donor') {
          localStorage.setItem('name', res.data.data.name);
          localStorage.setItem('lastDonationDate', res.data.data.lastDonationDate);
        } else if (endpoint === 'admin' && res.data.data.role !== 'superadmin') {
          localStorage.setItem('workplaceId', res.data.data.workplaceId);
          localStorage.setItem('workplaceType', res.data.data.workplaceType);
        }
        
        // Set current user
        setCurrentUser({
          id: res.data.data[`${endpoint}Id`],
          role: endpoint === 'admin' ? res.data.data.role : 'donor',
          token: res.data.data.token,
          name: res.data.data.name,
          workplaceId: res.data.data.workplaceId,
          workplaceType: res.data.data.workplaceType,
          lastDonationDate: res.data.data.lastDonationDate
        });
        
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message || 'Login failed' };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Server error' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;
  
  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentUser.role);
    }
    return currentUser.role === requiredRole;
  };

  const value = {
    currentUser,
    isAuthenticated,
    hasRole,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};