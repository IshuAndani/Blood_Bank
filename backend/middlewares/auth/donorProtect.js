const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../../config/auth");
const { Donor } = require('../../models/Donor');
const {AppError} = require('../../utils/error.handler');

// Require donor to be logged in
exports.isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized for this route", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    const donor = await Donor.findById(decoded.id);
    if (!donor) {
      return next(new AppError("User no longer exists", 401));
    }

    req.donor = { id: donor._id };
    next();
  } catch (error) {
    return next(new AppError("Error in donor isLoggedIn", 500, error));
  }
};

// Soft-protect route (donor data optional)
exports.protectDonor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Allow through without donor
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    const donor = await Donor.findById(decoded.id);
    if (!donor) {
      return next(new AppError("User no longer exists", 401));
    }

    req.donor = { id: donor._id, city: donor.city };
    next();
  } catch (error) {
    return next(new AppError("Error in protectDonor", 500, error));
  }
};
