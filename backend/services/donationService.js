const mongoose = require('mongoose');
const moment = require('moment');
const { Donation } = require('../models/Donation');
const donorService = require('./donorService');
const inventoryService = require('./inventoryService');

// Create new donation with transaction to ensure all updates succeed or fail together
exports.createDonation = async (donationData) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { donorId, donatedAt } = donationData;
    const donor = await donorService.findDonorById(donorId);

    // Check if the donor's last donation date is less than 56 days ago
    if (donor.lastDonationDate) {
      const lastDonationDate = new Date(donor.lastDonationDate);
      const currentDate = new Date();
      const daysSinceLastDonation = Math.floor((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24)); // Calculate difference in days

      // If less than 56 days have passed, throw an error
      if (daysSinceLastDonation < 56) {
        const nextDonationDate = new Date(lastDonationDate);
        nextDonationDate.setDate(lastDonationDate.getDate() + 56); // Calculate the date when they can donate next
        const errorMessage = `You cannot donate blood yet. You can donate on ${nextDonationDate.toISOString().split('T')[0]}.`;
        throw new Error(errorMessage);
      }
    }

    // Create donation document
    const newDonation = new Donation({
      donor : donorId,
      bloodGroup : donor.bloodGroup,
      donatedAt
    });
    
    await newDonation.save({ session });
    
    donor.donations.push(newDonation._id);
    donor.lastDonationDate = new Date();
    await donor.save({session});
    // Update donor's donation history and last donation date
    // await donorService.addDonationToHistory(donorId, newDonation._id, session);
    
    // Update blood bank inventory
    await inventoryService.addBloodToInventory(donatedAt, donor.bloodGroup, session);
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    return newDonation;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating donation:', error);
    throw new Error(error.message || 'Error creating donation');
  }
};

// Get donations by donor
exports.getDonationsByDonor = async (donorId) => {
  try {
    return await Donation.find({ donor: donorId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('donatedAt', 'name city');
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw new Error('Error fetching donation history');
  }
};

// Get donations by blood bank
exports.getDonationsByBloodBank = async (bloodBankId) => {
  try {
    return await Donation.find({ donatedAt: bloodBankId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('donor', 'name email bloodGroup');
  } catch (error) {
    console.error('Error fetching blood bank donations:', error);
    throw new Error('Error fetching donation records');
  }
};