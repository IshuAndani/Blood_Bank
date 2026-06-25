const { BloodBank } = require('../models/BloodBank');
const { Inventory } = require('../models/Inventory');
const inventoryService = require('./inventoryService');
const { AppError } = require('../utils/error.handler');
const {isValidCity} = require('../utils/validator');

const createBloodBank = async (name, city, coordinates) => {
  if (!name || !city) {
    throw new AppError('Name and city are required', 400);
  }

  const existing = await BloodBank.findOne({ name });
  if (existing) {
    throw new AppError(`Blood Bank with the name "${name}" already exists.`, 400);
  }

  if (!isValidCity(city)) {
    throw new AppError('Invalid city', 400);
  }

  // Validate and destructure coordinates
  const { lat, lng } = coordinates || {};
  if (
    typeof lat !== 'number' || lat < -90 || lat > 90 ||
    typeof lng !== 'number' || lng < -180 || lng > 180
  ) {
    throw new AppError('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180', 400);
  }

  const bloodBank = new BloodBank({
    name,
    city,
    employees: { headadmin: [], admin: [] },
    location: {
      type: 'Point',
      coordinates: [lng, lat]  // GeoJSON format: [longitude, latitude]
    }
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

const getBloodBanks = async() => {
  return await BloodBank.find({});
}

module.exports = {
  createBloodBank,
  getBloodBanksByBloodGroup,
  getBloodBanks
};
