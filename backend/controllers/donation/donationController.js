const donationService = require('../../services/donationService');
const donorService = require('../../services/donorService');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

// Create new donation
exports.createDonation = asyncHandler(async (req, res) => {
  try {
    const { donorId, quantity } = req.body;
    const bloodBankId = req.admin.workplace; // From auth middleware
    
    // Validate required fields
    if (!donorId || !quantity) {
      return errorResponse(res, 400, 'Donor ID, blood group, and quantity are required');
    }
    
    // Create donation
    const donation = await donationService.createDonation({
      donorId,
      quantity,
      donatedAt: bloodBankId
    });
    
    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      donation: {
        id: donation._id,
        donor: donation.donor,
        bloodGroup: donation.bloodGroup,
        quantityMl: donation.quantity,
        donatedAt: donation.donatedAt,
        createdAt: donation.createdAt
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error creating donation', error.message);
  }
});

// Get donation history for a donor
exports.getDonorDonations = asyncHandler(async (req, res) => {
  try {
    const { donorId } = req.params;
    
    const donations = await donationService.getDonationsByDonor(donorId);
    
    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error fetching donation history', error.message);
  }
});

// Get donations for a blood bank
exports.getBloodBankDonations = asyncHandler(async (req, res) => {
  try {
    const bloodBankId = req.admin.workplace; // From auth middleware
    
    const donations = await donationService.getDonationsByBloodBank(bloodBankId);
    
    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error fetching blood bank donations', error.message);
  }
});