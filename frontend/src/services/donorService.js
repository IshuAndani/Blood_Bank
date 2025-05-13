// src/services/donorService.js
/**
 * Service for donor-related API calls
 */
export const donorService = {
    /**
     * Search for a donor by email
     * @param {string} email - Donor email
     * @returns {Promise} - Response from API
     */
    searchDonor: async (email) => {
      try {
        return await api.get(`/donor/search?email=${email}`);
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Register a new donor by admin
     * @param {object} donorData - Donor data
     * @returns {Promise} - Response from API
     */
    createDonor: async (donorData) => {
      try {
        return await api.post('/donor/create', donorData);
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Get donor donations
     * @returns {Promise} - Response from API
     */
    getDonorDonations: async () => {
      try {
        return await api.get('/donor/donations');
      } catch (error) {
        throw error;
      }
    }
  };