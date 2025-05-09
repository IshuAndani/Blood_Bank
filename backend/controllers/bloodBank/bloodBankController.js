const { BloodBank } = require('../../models/BloodBank');
const { Inventory } = require('../../models/Inventory');
const { BLOOD_GROUP_MAP } = require('../../../shared/constants/bloodGroups');
const inventoryService = require('../../services/inventoryService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { errorResponse } = require('../../utils/errorResponse');

exports.createBloodBank = async (req, res) => {
  try {
    const { name, city } = req.body;

    if(!name || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name and city are required'
      });
    }

    // Check if the blood bank with the same name already exists
    const existingBloodBank = await BloodBank.findOne({ name });
    if (existingBloodBank) {
      return res.status(400).json({
        success: false,
        message: `Blood Bank with the name "${name}" already exists.`
      });
    }

    const superadminId = req.admin.id; // from protect middleware

    const newBloodBank = new BloodBank({
      name,
      city,
      employees: {
        headadmin: [],
        admin: []
      }
    });

    await newBloodBank.save();

    // Create inventory for the new blood bank
    const inventory = await inventoryService.createInventory(newBloodBank._id);
    
    // Update blood bank with inventory reference
    newBloodBank.inventory = inventory._id;
    await newBloodBank.save();

    res.status(201).json({
      success: true,
      message: 'Blood Bank created successfully',
      BloodBank: newBloodBank,
      inventory: {
        id: inventory._id,
        bloodGroups: inventory.bloodGroups
      }
    });

  } catch (error) {
    console.error('Error creating blood bank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.getBloodBanksByBloodGroup = async (req, res) => {
  const friendlyName = req.query.bloodGroup; // e.g., 'O-positive'
  const actualKey = BLOOD_GROUP_MAP[friendlyName];
  console.log(actualKey);

  if (!actualKey) {
    return res.status(400).json({ success: false, message: 'Blood group is required' });
  }

  try {
    const inventories = await Inventory.find({ [`bloodGroups.${actualKey}`]: { $gt: 0 } })
      .populate('bloodBank', 'id name city'); // only get name and city
    console.log(inventories);
    const result = inventories.map(inv => ({
      id : inv.bloodBank?._id,
      name: inv.bloodBank?.name,
      city: inv.bloodBank?.city,
      availableUnits: inv.bloodGroups[actualKey]
    }));

    return res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error('Error in blood group search:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
