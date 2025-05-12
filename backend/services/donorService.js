const { Donor } = require('../models/Donor');
const { BloodBank } = require('../models/BloodBank');
const { cleanString } = require('../utils/cleanString');
const { comparePassword, generateRandomPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/generateToken');
const { transporter } = require('../utils/nodemailer');
const { AppError } = require('../utils/error.handler');
const validator = require('validator');
const { isValidDOB, isValidCity, isValidBloodGroup } = require('../utils/validator');
const donationService = require('./donationService');
const { Donation } = require('../models/Donation');

// Validate input
const validateDonorInput = ({ name, email, password, bloodGroup, city, dob }, { isAdmin = false } = {}) => {
  if (!name || !email || !bloodGroup || !city || !dob || (!isAdmin && !password)) {
    throw new AppError('All fields are required', 400);
  }

  const cleanedName = cleanString(name);
  const cleanedEmail = cleanString(email).toLowerCase();

  if (!validator.isEmail(cleanedEmail)) {
    throw new AppError('Invalid email format', 400);
  }

  if (!isAdmin && password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  if (!isValidCity(city)) {
    throw new AppError('Invalid city', 400);
  }

  if (!isValidBloodGroup(bloodGroup)) {
    throw new AppError('Invalid blood group', 400);
  }

  if (!isValidDOB(dob)) {
    throw new AppError('Invalid date of birth. Age must be between 18 and 65.', 400);
  }

  return { name: cleanedName, email: cleanedEmail };
};


// Register donor
exports.registerDonor = async (data) => {
  const { name, email } = validateDonorInput(data);

  const existing = await Donor.findOne({ email });
  if (existing) throw new AppError('Donor with this email already exists', 409);

  const donor = await Donor.create({
    name,
    email,
    password: data.password,
    bloodGroup: data.bloodGroup,
    city: data.city,
    dob: data.dob,
  });

  return { id: donor._id, email: donor.email };
};


// Login donor
exports.loginDonor = async ({ email, password }) => {
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const cleanedEmail = cleanString(email).toLowerCase();
  if (!validator.isEmail(cleanedEmail)) {
    throw new AppError('Invalid email format', 400);
  }

  const donor = await Donor.findOne({ email: cleanedEmail });
  if (!donor) throw new AppError('Invalid credentials', 401);

  const isMatch = await comparePassword(password, donor.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateToken({
    id: donor._id,
    bloodGroup: donor.bloodGroup,
    role: 'donor',
  });

  return {
    name : donor.name,
    token: `Bearer ${token}`,
    donorId: donor._id,
    lastDonationDate: donor.lastDonationDate,
  };
};

// Admin: Search donor
exports.searchDonor = async (email) => {
  if (!email) throw new AppError('Email is required for search', 400);

  const cleanedEmail = cleanString(email).toLowerCase();
  if(!validator.isEmail(cleanedEmail)) throw new AppError('Invalid email format', 400);

  const donor = await Donor.findOne({ email: cleanedEmail});
  if (!donor) throw new AppError('Donor not found', 404);

  const donations = await donationService.getDonationsByDonor(donor._id);

  return {
    donorId: donor._id,
    name: donor.name,
    email: donor.email,
    bloodGroup: donor.bloodGroup,
    city: donor.city,
    lastDonationDate: donor.lastDonationDate,
    dob: donor.dob,
    ...donations
  };
};

// Admin: Create donor and send email
exports.createDonorByAdmin = async (data) => {
  const { name, email } = validateDonorInput(data, { isAdmin: true });

  const existing = await Donor.findOne({ email });
  if (existing) throw new AppError('Donor with this email already exists', 409);

  const password = generateRandomPassword(10);
  console.log(password);
  const donor = await Donor.create({
    name,
    email,
    password,
    bloodGroup: data.bloodGroup,
    city: data.city,
    dob: data.dob,
  });

  try {
    await transporter.sendMail({
      from: `"Blood Bank App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Donor Login Password',
      text: `Hello ${name},\n\nYou have been registered as a donor.\nYour login password is: ${password}\nPlease log in and change your password.`,
    });
  } catch (err) {
    throw new AppError('Failed to send email to donor', 500, err);
  }

  return { donorId: donor._id, email: donor.email, bloodGroup : donor.bloodGroup };
};


// Logged-in donor: get donations
exports.getDonations = async (donorId) => {
  const res = await Donation.find({donor : donorId}).populate('donatedAt','name city');
  const donations = res.map(d => ({
    BloodBank : {
      name : d.donatedAt.name,
      city : d.donatedAt.city
    },
    date : d.createdAt
  }))
  return {donations};
  // const donor = await Donor.findById(donorId).populate({
  //   path: 'donations',
  //   select: 'createdAt donatedAt',
  //   populate: {
  //     path: 'donatedAt',
  //     model: 'BloodBank',
  //     select: 'name city',
  //   },
  // });

  // if (!donor) throw new AppError('Donor not found', 404);

  // return donor.donations;
};

// Get blood banks by city (query > fallback to donor city)
exports.getBloodBanks = async (queryCity, donorCity) => {
  const city = queryCity || donorCity;
  if(!isValidCity(city)) throw new AppError('Invalid city', 400);
  if (!city) throw new AppError('Please provide city or login first', 400);

  const bloodbanks = await BloodBank.find({ city }).select('name');
  return bloodbanks.map((b) => b.name);
};

// Utility: find by email
exports.findDonorByEmail = async (email) => {
  return await Donor.findOne({ email: cleanString(email).toLowerCase() });
};

// Utility: find by ID
exports.findDonorById = async (id) => {
  const donor = await Donor.findById(id);
  if (!donor) throw new AppError('Donor not found', 404);
  return donor;
};

// Utility: update donor
exports.updateDonor = async (donorId, updateData) => {
  const donor = await Donor.findByIdAndUpdate(donorId, { $set: updateData }, { new: true });
  if (!donor) throw new AppError('Donor not found', 404);
  return donor;
};

// Utility: add donation
exports.addDonationToHistory = async (donorId, donationId) => {
  const donor = await Donor.findByIdAndUpdate(
    donorId,
    {
      $push: { donations: donationId },
      lastDonationDate: new Date(),
    },
    { new: true }
  );

  if (!donor) throw new AppError('Donor not found', 404);
  return donor;
};
