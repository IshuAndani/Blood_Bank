const { Inventory } = require('../models/Inventory');
const { Shortage } = require('../models/Shortage');
const { threshold } = require('../../shared/constants/threshold');

// Create inventory for a new blood bank
exports.createInventory = async (bloodBankId) => {
  try {
    const newInventory = new Inventory({
      bloodBank: bloodBankId,
      // Default values for blood groups are set in the schema
    });
    
    await newInventory.save();
    return newInventory;
  } catch (error) {
    console.error('Error creating inventory:', error);
    throw new Error('Error creating inventory for blood bank');
  }
};

// Add blood to inventory
exports.addBloodToInventory = async (bloodBankId, bloodGroup, session = null) => {
  try {
    const inventory = await Inventory.findOne({ bloodBank: bloodBankId });
    
    if (!inventory) {
      throw new Error('Inventory not found for this blood bank');
    }
    
    // Update inventory with new blood units
    const updateQuery = {};
    updateQuery[`bloodGroups.${bloodGroup}`] = 1; // No conversion needed
    
    const options = { new: true };
    if (session) options.session = session;
    
    const updatedInventory = await Inventory.findOneAndUpdate(
      { bloodBank: bloodBankId },
      { $inc: updateQuery },
      options
    );

    const shortage = await Shortage.findOne({
      bloodBank : bloodBankId,
      bloodGroup : bloodGroup,
      resolved : false
    });
    console.log("updated inventory amount = " + updatedInventory.bloodGroups[bloodGroup]);
    if(shortage && updatedInventory.bloodGroups[bloodGroup] > threshold){
      shortage.resolved = true;
      console.log("shortage resolved");
      await shortage.save(session);
    }
    
    return updatedInventory;
  } catch (error) {
    console.error('Error adding blood to inventory:', error);
    throw new Error('Error updating inventory');
  }
};

// Get inventory for a blood bank
exports.getInventory = async (bloodBankId) => {
  try {
    return await Inventory.findOne({ bloodBank: bloodBankId });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw new Error('Error fetching inventory data');
  }
};