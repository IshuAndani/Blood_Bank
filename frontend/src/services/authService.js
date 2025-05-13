import api from './api';

/**
 * Service for authentication-related API calls
 */
export const authService = {
  /**
   * Login a donor
   * @param {object} credentials - { email, password }
   * @returns {Promise} - Response from API
   */
  donorLogin: async (credentials) => {
    try {
      return await api.post('/donor/login', credentials);
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Register a new donor
   * @param {object} donorData - Donor registration data
   * @returns {Promise} - Response from API
   */
  donorRegister: async (donorData) => {
    try {
      return await api.post('/donor/register', donorData);
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Login an admin
   * @param {object} credentials - { email, password }
   * @returns {Promise} - Response from API
   */
  adminLogin: async (credentials) => {
    try {
      return await api.post('/admin/login', credentials);
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Register a new admin
   * @param {object} adminData - Admin registration data
   * @returns {Promise} - Response from API
   */
  adminRegister: async (adminData) => {
    try {
      return await api.post('/admin/register', adminData);
    } catch (error) {
      throw error;
    }
  }
};