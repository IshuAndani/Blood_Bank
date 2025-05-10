const mongoose = require('mongoose');
const { Donation } = require('../models/Donation');
const { Inventory } = require('../models/Inventory');
const donorService = require('./donorService');
const inventoryService = require('./inventoryService');
const { donationExpireTime, donorEligibleTime } = require('../config/constants');
const { AppError } = require('../utils/error.handler');
const { threshold } = require('../../shared/constants/threshold');
const { createShortage } = require('../services/shortageService');

exports.createDonation = async (donationData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { donorId, donatedAt } = donationData;

    if (!donorId) {
      throw new AppError('Donor ID is required', 400);
    }

    const donor = await donorService.findDonorById(donorId);
    if (!donor) {
      throw new AppError('Donor not found', 404);
    }

    if (donor.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const now = new Date();

      if (now - lastDonation < donorEligibleTime) {
        const eligibleDate = new Date(lastDonation);
        eligibleDate.setDate(lastDonation.getDate() + donorEligibleTime / (1000 * 60 * 60 * 24));
        throw new AppError(`You can donate on ${eligibleDate.toISOString().split('T')[0]}`, 400);
      }
    }

    const newDonation = new Donation({
      donor: donorId,
      bloodGroup: donor.bloodGroup,
      donatedAt
    });

    await newDonation.save({ session });

    donor.donations.push(newDonation._id);
    donor.lastDonationDate = new Date();
    await donor.save({ session });

    await inventoryService.addBloodToInventory(donatedAt, donor.bloodGroup, session);

    await session.commitTransaction();
    session.endSession();

    return {
      id: newDonation._id,
      donor: newDonation.donor,
      bloodGroup: newDonation.bloodGroup,
      donatedAt: newDonation.donatedAt,
      createdAt: newDonation.createdAt
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating donation:', err);
    throw err;
  }
};

exports.getDonationsByDonor = async (donorId) => {
  try {
    const donations = await Donation.find({ donor: donorId })
      .sort({ createdAt: -1 })
      .populate('donatedAt', 'name city');

    return {
      count: donations.length,
      donations
    };
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw new AppError('Error fetching donation history', 500);
  }
};

exports.getDonationsByBloodBank = async (bloodBankId) => {
  try {
    const donations = await Donation.find({ donatedAt: bloodBankId })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email bloodGroup');

    return {
      count: donations.length,
      donations
    };
  } catch (error) {
    console.error('Error fetching blood bank donations:', error);
    throw new AppError('Error fetching donation records', 500);
  }
};

// Check and update expired donations
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
        if (inventory.bloodGroups[donation.bloodGroup] <= threshold) {
          createShortage(donation.donatedAt, donation.bloodGroup);
        }
        await inventory.save({ session });
      }

      await donation.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return expiredDonations;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error while checking expired donations:', err);
    throw new AppError('Error while checking expired donations:', 500, err);
  }
};