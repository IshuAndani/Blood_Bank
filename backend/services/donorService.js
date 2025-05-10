const { Donor } = require('../models/Donor');
const { BloodBank } = require('../models/BloodBank');
const { cleanString } = require('../utils/cleanString');
const { comparePassword, generateRandomPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/generateToken');
const { transporter } = require('../utils/nodemailer');
const { AppError } = require('../utils/error.handler');
const validator = require('validator');

// Validate input
const validateDonorInput = ({ name, email, password, bloodGroup, city, dob }) => {
  if (!name || !email || !bloodGroup || !city || !dob) {
    throw new AppError('All fields are required', 400);
  }
  if (!validator.isEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }
  if (password && password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }
};

// Register donor
exports.registerDonor = async (data) => {
  validateDonorInput(data);

  const email = cleanString(data.email).toLowerCase();
  const existing = await Donor.findOne({ email });
  if (existing) throw new AppError('Donor with this email already exists', 409);

  const donor = await Donor.create({
    name: cleanString(data.name),
    email,
    password: data.password,
    bloodGroup: data.bloodGroup,
    city: data.city,
    dob: data.dob,
  });

  return {
    id: donor._id,
    email: donor.email,
  };
};

// Login donor
exports.loginDonor = async ({ email, password }) => {
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const donor = await Donor.findOne({ email: cleanString(email).toLowerCase() });
  if (!donor) throw new AppError('Invalid credentials', 401);

  const isMatch = await comparePassword(password, donor.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateToken({
    id: donor._id,
    bloodGroup: donor.bloodGroup,
    role: 'donor',
  });

  return {
    token: `Bearer ${token}`,
    donorId: donor._id,
    lastDonationDate: donor.lastDonationDate,
  };
};

// Admin: Search donor
exports.searchDonor = async (email) => {
  if (!email) throw new AppError('Email is required for search', 400);

  const donor = await Donor.findOne({ email: cleanString(email).toLowerCase() });
  if (!donor) throw new AppError('Donor not found', 404);

  return {
    id: donor._id,
    name: donor.name,
    email: donor.email,
    bloodGroup: donor.bloodGroup,
    city: donor.city,
    lastDonationDate: donor.lastDonationDate,
  };
};

// Admin: Create donor and send email
exports.createDonorByAdmin = async (data) => {
  const { name, email, bloodGroup, city, dob } = data;
  if (!name || !email || !bloodGroup || !city || !dob) {
    throw new AppError('Name, email, blood group, city, and dob are required', 400);
  }

  const cleanedEmail = cleanString(email).toLowerCase();
  const existing = await Donor.findOne({ email: cleanedEmail });
  if (existing) throw new AppError('Donor with this email already exists', 409);

  const password = generateRandomPassword(10);

  const donor = await Donor.create({
    name: cleanString(name),
    email: cleanedEmail,
    password,
    bloodGroup,
    city,
    dob,
  });

  try {
    await transporter.sendMail({
      from: `"Blood Bank App" <${process.env.EMAIL_USER}>`,
      to: cleanedEmail,
      subject: 'Your Donor Login Password',
      text: `Hello ${name},\n\nYou have been registered as a donor.\nYour login password is: ${password}\nPlease log in and change your password.`,
    });
  } catch (err) {
    throw new AppError('Failed to send email to donor', 500,err);
  }

  return {
    donorId: donor._id,
    email: donor.email,
  };
};

// Logged-in donor: get donations
exports.getDonations = async (donorId) => {
  const donor = await Donor.findById(donorId).populate({
    path: 'donations',
    select: 'createdAt donatedAt',
    populate: {
      path: 'donatedAt',
      model: 'BloodBank',
      select: 'name city',
    },
  });

  if (!donor) throw new AppError('Donor not found', 404);

  return donor.donations;
};

// Get blood banks by city (query > fallback to donor city)
exports.getBloodBanks = async (queryCity, donorCity) => {
  const city = queryCity || donorCity;
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

// Utility: create donor
exports.createDonor = async (donorData) => {
  const name = cleanString(donorData.name);
  const email = cleanString(donorData.email).toLowerCase();
  const { bloodGroup, city, password, dob } = donorData;

  const existing = await Donor.findOne({ email });
  if (existing) throw new AppError('Donor with this email already exists', 409);

  const donor = new Donor({
    name,
    email,
    password,
    bloodGroup,
    city,
    dob,
  });

  await donor.save();
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
