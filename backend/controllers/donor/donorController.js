const donorService = require('../../services/donorService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');

// Public donor registration
exports.registerDonor = asyncHandler(async (req, res) => {
  const data = await donorService.registerDonor(req.body);
  sendResponse(res, 201, true, 'Donor registered successfully', data);
});

// Donor login
exports.loginDonor = asyncHandler(async (req, res) => {
  const data = await donorService.loginDonor(req.body);
  sendResponse(res, 200, true, 'Login successful', data);
});

// Admin search donor by email
exports.searchDonor = asyncHandler(async (req, res) => {
  const data = await donorService.searchDonor(req.query.email);
  sendResponse(res, 200, true, 'Donor found', data);
});

// Admin create donor with auto password + email
exports.createDonorByAdmin = asyncHandler(async (req, res) => {
  const data = await donorService.createDonorByAdmin(req.body);
  sendResponse(res, 201, true, 'Donor created successfully', data);
});

// Get donation history for logged-in donor
exports.getDonations = asyncHandler(async (req, res) => {
  const data = await donorService.getDonations(req.donor.id);
  sendResponse(res, 200, true, 'Donations fetched', data);
});

// Get list of blood banks (by query or donor city)
exports.getBloodBanks = asyncHandler(async (req, res) => {
  const data = await donorService.getBloodBanks(req.query.city, req.donor?.city);
  sendResponse(res, 200, true, 'Blood banks fetched', data);
});
