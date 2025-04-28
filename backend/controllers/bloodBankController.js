const { BloodBank } = require('../models/BloodBank');
const { asyncHandler } = require('../utils/asyncHandler')

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
        headadmins: [],
        admins: [],
        observers: []
      }
    });

    await newBloodBank.save();

    res.status(201).json({
      success: true,
      message: 'Blood Bank created successfully',
      BloodBank: newBloodBank
    });

  } catch (error) {
    console.error('Error creating blood bank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
