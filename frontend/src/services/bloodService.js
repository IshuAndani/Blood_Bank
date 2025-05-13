// src/services/bloodService.js
/**
 * Service for blood-related API calls
 */
export const bloodService = {
    /**
     * Create a donation
     * @param {object} donationData - { donorId }
     * @returns {Promise} - Response from API
     */
    createDonation: async (donationData) => {
      try {
        return await api.post('/donation/create', donationData);
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Get all donations for a blood bank
     * @returns {Promise} - Response from API
     */
    getAllDonations: async () => {
      try {
        return await api.get('/donation');
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Get blood requests
     * @returns {Promise} - Response from API
     */
    getBloodRequests: async () => {
      try {
        return await api.get('/bloodrequest');
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Update blood request status
     * @param {string} id - Request ID
     * @param {object} data - { status, reason }
     * @returns {Promise} - Response from API
     */
    updateRequestStatus: async (id, data) => {
      try {
        return await api.patch(`/bloodrequest/${id}/status`, data);
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Search blood banks by blood group
     * @param {string} bloodGroup - Blood group
     * @returns {Promise} - Response from API
     */
    searchBloodBanks: async (bloodGroup) => {
      try {
        return await api.get(`/bloodbank/search?bloodGroup=${bloodGroup}`);
      } catch (error) {
        throw error;
      }
    },
    
    /**
     * Create blood request
     * @param {object} requestData - { bloodGroup, BloodBankId }
     * @returns {Promise} - Response from API
     */
    createBloodRequest: async (requestData) => {
      try {
        return await api.post('/bloodrequest/create', requestData);
      } catch (error) {
        throw error;
      }
    }
  };