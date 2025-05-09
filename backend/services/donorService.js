const { Donor } = require('../models/Donor');
const { cleanString } = require('../utils/cleanString');

// Find donor by email
exports.findDonorByEmail = async (email) => {
  try {
    return await Donor.findOne({ email: cleanString(email).toLowerCase() });
  } catch (error) {
    console.error('Error finding donor:', error);
    throw new Error('Error finding donor');
  }
};

exports.findDonorById = async (id) => {
  try {
    const donor = await Donor.findById(id);
    if(!donor){
      const err = new Error('Cannot find donor with given ID');
      err.statusCode = 404;
      throw err;
    }
    return donor;
  } catch (error) {
    // console.error('Error finding donor:', error);
    throw error;
  }
};

// Create new donor
exports.createDonor = async (donorData) => {
  try {
    // Clean input data
    const name = cleanString(donorData.name);
    const email = cleanString(donorData.email).toLowerCase();
    const { bloodGroup, city, password, dob } = donorData;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      throw new Error('Donor with this email already exists');
    }

    // Create new donor
    const newDonor = new Donor({
      name,
      email,
      password,
      bloodGroup,
      city,
      dob
    });

    await newDonor.save();
    return newDonor;
  } catch (error) {
    console.error('Error creating donor:', error);
    throw new Error(error.message || 'Error creating donor');
  }
};

// Update donor
exports.updateDonor = async (donorId, updateData) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      donorId,
      { $set: updateData },
      { new: true }
    );
    
    if (!donor) {
      throw new Error('Donor not found');
    }
    
    return donor;
  } catch (error) {
    console.error('Error updating donor:', error);
    throw new Error('Error updating donor');
  }
};

// Add donation to donor's record
exports.addDonationToHistory = async (donorId, donationId) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      donorId,
      { 
        $push: { donations: donationId },
        lastDonationDate: new Date()
      },
      { new: true }
    );
    
    if (!donor) {
      throw new Error('Donor not found');
    }
    
    return donor;
  } catch (error) {
    console.error('Error adding donation to donor history:', error);
    throw new Error('Error updating donor donation history');
  }
};