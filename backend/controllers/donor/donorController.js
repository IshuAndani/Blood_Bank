const donorService = require('../../services/donorService');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { comparePassword } = require('../../utils/passwordUtils');
const { generateToken } = require('../../utils/generateToken');
const { Donor } = require('../../models/Donor');
const {BloodBank} = require('../../models/BloodBank');
// const { generatePassword } = require('../../utils/passwordUtils');

// Controller for public donor registration
exports.registerDonor = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, dob } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !bloodGroup || !city || !dob) {
      return errorResponse(res, 400, 'All fields are required');
    }
    
    // Create donor
    const donor = await donorService.createDonor({
      name,
      email,
      password,
      bloodGroup,
      city,
      dob
    });
    
    // Return success without sensitive info
    res.status(201).json({
      success: true,
      message: 'Donor registered successfully',
      donorId: donor._id,
      donorEmail: donor.email
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
      bloodGroup : existingDonor.bloodGroup,
      role : "donor"
    };

    // Generate token
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `Bearer ${token}`,
      donorId: existingDonor._id,
      lastDonationDate : existingDonor.lastDonationDate
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
      console.log("donor not found");
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
    const { name, email, password, bloodGroup, city, dob } = req.body;
    
    // Validate required fields
    if (!name || !email || !bloodGroup || !city || !dob) {
      return errorResponse(res, 400, 'Name, email, password, blood group, city and dob are required');
    }
    
    // Create donor
    const donor = await donorService.createDonor({
      name,
      email,
      password, 
      bloodGroup,
      city,
      dob
    });
    
    res.status(201).json({
      success: true,
      message: 'Donor created successfully',
      donorId: donor._id
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

exports.getDonations = async(req,res) => {
  try{
    // const donor = req.donor;
    // if(!donor) errorResponse(res,401,"donor not found");
    
    const donorWithDonations = await Donor.findById(req.donor.id)
      .populate({
        path: 'donations',
        select: 'createdAt donatedAt',
        populate: {
          path: 'donatedAt',
          model: 'BloodBank',
          select: 'name city'
        }
      });

    res.status(200).json({
      success: true,
      donations: donorWithDonations.donations,
    });
  }catch(error){
    errorResponse(res,500,"error fetching donations",error);
  }
}

exports.getBloodBanks = async(req,res) => {
  try {
    let {city} = req.query;

    if(!city){
      if(!req.donor) errorResponse(res,400,"Please provide city or LOGIN");
      // let donor = await Donor.findById(req.admin.id)
      city = req.donor.city;
    }
    
    const bloodbanksInCity = await BloodBank.find({city : city});

    const bloodbanks = bloodbanksInCity.map(bloodbank => bloodbank.name);
    
    return res.status(200).json({
      success : true,
      city : city,
      bloodbanks
    });

  } catch (error) {
    errorResponse(res,500,"Error getting bloodbanks", error);
  }
}