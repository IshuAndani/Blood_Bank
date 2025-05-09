const donorService = require('../../services/donorService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { comparePassword, generateRandomPassword } = require('../../utils/passwordUtils');
const { generateToken } = require('../../utils/generateToken');
const { Donor } = require('../../models/Donor');
const { BloodBank } = require('../../models/BloodBank');
const { transporter } = require('../../utils/nodemailer');

// Controller for public donor registration
exports.registerDonor = asyncHandler(async (req, res) => {
  const { name, email, password, bloodGroup, city, dob } = req.body;

  if (!name || !email || !password || !bloodGroup || !city || !dob) {
    const err = new Error('All fields are required');
    err.statusCode = 400;
    throw err;
  }

  try {
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
      message: 'Donor registered successfully',
      donorId: donor._id,
      donorEmail: donor.email
    });
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    throw error;
  }
});

exports.loginDonor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('All fields are required');
    err.statusCode = 400;
    throw err;
  }

  try {
    const existingDonor = await donorService.findDonorByEmail(email);
    if (!existingDonor) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, existingDonor.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      id: existingDonor._id,
      bloodGroup: existingDonor.bloodGroup,
      role: 'donor'
    };

    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `Bearer ${token}`,
      donorId: existingDonor._id,
      lastDonationDate: existingDonor.lastDonationDate
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
});

// Controller for admins to search donors
exports.searchDonor = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    const err = new Error('Email is required for search');
    err.statusCode = 400;
    throw err;
  }

  try {
    const donor = await donorService.findDonorByEmail(email);

    if (!donor) {
      const err = new Error('Donor not found');
      err.statusCode = 404;
      throw err;
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
    error.statusCode = error.statusCode || 500;
    throw error;
  }
});

// Controller for admins to create donor
exports.createDonorByAdmin = asyncHandler(async (req, res) => {
  const { name, email, bloodGroup, city, dob } = req.body;

  if (!name || !email || !bloodGroup || !city || !dob) {
    const err = new Error('Name, email, blood group, city and dob are required');
    err.statusCode = 400;
    throw err;
  }

  const password = generateRandomPassword(10);

  try {
    await transporter.sendMail({
      from: `"Blood Bank App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Donor Login Password",
      text: `Hello ${name},\n\nYou have been registered as a donor.\nYour login password is: ${password}\nPlease log in and change your password.`,
    });

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
    error.statusCode = error.statusCode || 400;
    throw error;
  }
});

exports.getDonations = asyncHandler(async (req, res) => {
  try {
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

    if (!donorWithDonations) {
      const err = new Error('Donor not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      donations: donorWithDonations.donations,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
});

exports.getBloodBanks = asyncHandler(async (req, res) => {
  try {
    let { city } = req.query;

    if (!city) {
      if (!req.donor) {
        const err = new Error('Please provide city or login first');
        err.statusCode = 400;
        throw err;
      }
      city = req.donor.city;
    }

    const bloodbanksInCity = await BloodBank.find({ city });

    const bloodbanks = bloodbanksInCity.map(b => b.name);

    res.status(200).json({
      success: true,
      city,
      bloodbanks
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
});
