const donorService = require('../../services/donorService');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { comparePassword } = require('../../utils/passwordUtils');
const { generateToken } = require('../../utils/generateToken');
// const { generatePassword } = require('../../utils/passwordUtils');

// Controller for public donor registration
exports.registerDonor = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !bloodGroup || !city) {
      return errorResponse(res, 400, 'All fields are required');
    }
    
    // Create donor
    const donor = await donorService.createDonor({
      name,
      email,
      password,
      bloodGroup,
      city
    });
    
    // Return success without sensitive info
    res.status(201).json({
      success: true,
      message: 'Donor registered successfully',
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        city: donor.city
      }
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

exports.loginDonor = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if ( !email || !password ) {
      return errorResponse(res, 400, 'All fields are required');
    }
    
    const existingDonor = await donorService.findDonorByEmail(email);

    if (!existingDonor) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, existingDonor.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT payload
    const payload = {
      id: existingDonor._id,
    };

    // Generate token
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `Bearer ${token}`,
      donor: {
        id: existingDonor._id,
        name: existingDonor.name,
        email: existingDonor.email,
        bloodGroup: existingDonor.bloodGroup,
        city: existingDonor.city
      }
    });
  } catch (error) {
      console.error('Error during login:', error.message);
      return errorResponse(res, 500, 'Error during login', error.message);
  }
});

// Controller for admins to search donors
exports.searchDonor = asyncHandler(async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return errorResponse(res, 400, 'Email is required for search');
    }
    
    const donor = await donorService.findDonorByEmail(email);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        lastDonationDate: donor.lastDonationDate
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error searching for donor', error.message);
  }
});

// Controller for admins to create donor
exports.createDonorByAdmin = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city } = req.body;
    
    // Validate required fields
    if (!name || !email || !bloodGroup || !city) {
      return errorResponse(res, 400, 'Name, email, password, blood group, and city are required');
    }
    
    // Create donor
    const donor = await donorService.createDonor({
      name,
      email,
      password, 
      bloodGroup,
      city
    });
    
    res.status(201).json({
      success: true,
      message: 'Donor created successfully',
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        password: password 
      }
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});