const { BloodBank } = require('../models/BloodBank');
const { Inventory } = require('../models/Inventory');
const inventoryService = require('./inventoryService');
const { AppError } = require('../utils/error.handler');

const createBloodBank = async (name, city, createdById) => {
  if (!name || !city) {
    throw new AppError('Name and city are required', 400);
  }

  const existing = await BloodBank.findOne({ name });
  if (existing) {
    throw new AppError(`Blood Bank with the name "${name}" already exists.`, 400);
  }

  const bloodBank = new BloodBank({
    name,
    city,
    employees: { headadmin: [], admin: [] }
  });

  await bloodBank.save();

  const inventory = await inventoryService.createInventory(bloodBank._id);

  bloodBank.inventory = inventory._id;
  await bloodBank.save();

  return {
    bloodBank,
    inventory
  };
};

const getBloodBanksByBloodGroup = async (actualKey) => {
  if (!actualKey) {
    throw new AppError('Valid blood group is required', 400);
  }

  const inventories = await Inventory.find({ [`bloodGroups.${actualKey}`]: { $gt: 0 } })
    .populate('bloodBank', 'id name city');

  return inventories.map(inv => ({
    id: inv.bloodBank?._id,
    name: inv.bloodBank?.name,
    city: inv.bloodBank?.city,
    availableUnits: inv.bloodGroups[actualKey]
  }));
};

module.exports = {
  createBloodBank,
  getBloodBanksByBloodGroup
};
