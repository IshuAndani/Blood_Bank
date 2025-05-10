const mongoose = require('mongoose');
const { BloodRequest } = require('../models/BloodRequest');
const { BloodBank } = require('../models/BloodBank');
const { Hospital } = require('../models/Hospital');
const { Inventory } = require('../models/Inventory');
const { Donation } = require('../models/Donation');
const { threshold } = require('../../shared/constants/threshold');
const { createShortage } = require('./shortageService');
const { AppError } = require('../utils/error.handler');

exports.createBloodRequest = async (data, admin) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { bloodGroup, BloodBankId } = data;
    if (!bloodGroup || !BloodBankId) {
      throw new AppError('bloodGroup and BloodBankId are required', 400);
    }

    const bloodBank = await BloodBank.findById(BloodBankId);
    if (!bloodBank) throw new AppError('Cannot find bloodbank', 400);

    const hospital = await Hospital.findById(admin.workplaceId);
    if (!hospital) throw new AppError('Cannot find hospital', 400);

    const bloodRequest = new BloodRequest({
      bloodGroup,
      BloodBank: BloodBankId,
      Hospital: admin.workplaceId,
      status: 'pending'
    });

    await bloodRequest.save({ session });
    await session.commitTransaction();
    session.endSession();

    return bloodRequest;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.getBloodRequests = async (admin) => {
  if (admin.workplaceType === 'Hospital') {
    return BloodRequest.find({ Hospital: admin.workplaceId }).populate('BloodBank');
  }
  if (admin.workplaceType === 'BloodBank') {
    return BloodRequest.find({ BloodBank: admin.workplaceId }).populate('Hospital');
  }
  throw new AppError('workplaceType not valid', 400);
};

exports.updateBloodRequestStatus = async (id, status, reason, admin) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!['approved', 'rejected'].includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const bloodRequest = await BloodRequest.findById(id);
    if (!bloodRequest) throw new AppError('Blood request not found', 404);

    if (bloodRequest.BloodBank.toString() !== admin.workplaceId.toString()) {
      throw new AppError('Not authorized to update this request', 403);
    }

    if (bloodRequest.status !== 'pending') {
      throw new AppError('BloodRequest already settled', 400);
    }

    bloodRequest.status = status;
    if (status === 'rejected' && reason) bloodRequest.rejectReason = reason;

    if (status === 'approved') {
      const inventory = await Inventory.findOne({ bloodBank: admin.workplaceId });
      if (!inventory) throw new AppError('Inventory not found', 404);

      if (inventory.bloodGroups[bloodRequest.bloodGroup] <= 0) {
        throw new AppError('Insufficient blood in inventory', 400);
      }

      inventory.bloodGroups[bloodRequest.bloodGroup] -= 1;

      if (inventory.bloodGroups[bloodRequest.bloodGroup] <= threshold) {
        createShortage(bloodRequest.BloodBank, bloodRequest.bloodGroup);
      }

      const usedDonation = await Donation.findOne({
        status: 'stored',
        donatedAt: admin.workplaceId
      }).sort({ createdAt: 1 }).session(session);

      if (usedDonation) {
        usedDonation.status = 'used';
        await usedDonation.save({ session });
      }

      await inventory.save({ session });
    }

    await bloodRequest.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
