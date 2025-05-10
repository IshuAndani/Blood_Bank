const { Inventory } = require('../models/Inventory');
const { Shortage } = require('../models/Shortage');
const { threshold } = require('../../shared/constants/threshold');
const { AppError } = require('../utils/error.handler');

// Create inventory for a new blood bank
exports.createInventory = async (bloodBankId) => {
  try {
    const newInventory = new Inventory({ bloodBank: bloodBankId });
    await newInventory.save();
    return newInventory;
  } catch (error) {
    throw new AppError('Error creating inventory for blood bank', 500,error);
  }
};

// Add blood to inventory
exports.addBloodToInventory = async (bloodBankId, bloodGroup, session = null) => {
  try {
    const inventory = await Inventory.findOne({ bloodBank: bloodBankId });

    if (!inventory) {
      throw new AppError('Inventory not found for this blood bank', 404);
    }

    const updateQuery = {};
    updateQuery[`bloodGroups.${bloodGroup}`] = 1;

    const options = { new: true };
    if (session) options.session = session;

    const updatedInventory = await Inventory.findOneAndUpdate(
      { bloodBank: bloodBankId },
      { $inc: updateQuery },
      options
    );

    const shortage = await Shortage.findOne({
      bloodBank: bloodBankId,
      bloodGroup: bloodGroup,
      resolved: false
    });

    if (shortage && updatedInventory.bloodGroups[bloodGroup] > threshold) {
      shortage.resolved = true;
      await shortage.save({ session });
    }

    return updatedInventory;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error updating inventory', 500,error);
  }
};

// Get inventory for a blood bank
exports.getInventory = async (bloodBankId) => {
  try {
    const inventory = await Inventory.findOne({ bloodBank: bloodBankId });

    if (!inventory) {
      throw new AppError('Inventory not found for this blood bank', 404);
    }

    return inventory;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Error fetching inventory data', 500,error);
  }
};
