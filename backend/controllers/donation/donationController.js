const donationService = require('../../services/donationService');
const donorService = require('../../services/donorService');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { Donation } = require('../../models/Donation');
const { BloodBank } = require('../../models/BloodBank');
const { Inventory } = require('../../models/Inventory');
const { default: mongoose } = require('mongoose');
const { threshold } = require('../../../shared/constants/threshold');
const { createShortage } = require('../../utils/createShortage');
const { donationExpireTime } = require('../../config/constants');

// Create new donation
exports.createDonation = asyncHandler(async (req, res) => {
  try {
    const { donorId } = req.body;
    const bloodBankId = req.admin.workplaceId; // From auth middleware
    
    // Validate required fields
    if (!donorId ) {
      return errorResponse(res, 400, 'DonorID is required');
    }
    
    // Create donation
    const donation = await donationService.createDonation({
      donorId,
      donatedAt: bloodBankId
    });
    
    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      donation: {
        id: donation._id,
        donor: donation.donor,
        bloodGroup: donation.bloodGroup,
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
    const bloodBankId = req.admin.workplaceId; // From auth middleware
    
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

exports.checkExpiredDonations = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const expiredDonations = await Donation.find({
        status: "stored",
        createdAt: { $lte: new Date(Date.now() - donationExpireTime) }
      });
      for (const donation of expiredDonations) {
        donation.status = "expired";
  
        const inventory = await Inventory.findOne({ bloodBank: donation.donatedAt }).session(session);
  
        if (inventory && inventory.bloodGroups[donation.bloodGroup] > 0) {
          inventory.bloodGroups[donation.bloodGroup] -= 1;
          if(inventory.bloodGroups[donation.bloodGroup] <= threshold){
            createShortage(donation.donatedAt, donation.bloodGroup);
          }
          await inventory.save({ session });
        }
  
        await donation.save({ session });
        // notify bloodbank
        // 
      }
  
      await session.commitTransaction();
      console.log(`${expiredDonations.length} blood units marked as expired.`);
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("error while checking expired donations",err);
      // throw err; // Or pass to next(err)
    }
};