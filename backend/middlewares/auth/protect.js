const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/Admin');
const { jwtSecret } = require('../../config/auth');
const { Hospital } = require('../../models/Hospital');
const { BloodBank } = require('../../models/BloodBank');
const { AppError } = require('../../utils/error.handler'); // Custom error class
const { sendResponse } = require('../../utils/response.util'); // Response utility
const asyncHandler = require('../../utils/asyncHandler'); // Async handler for promise rejections

// Verify JWT token
exports.protect = async (req, res, next) => {
  try{
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, respond with an error
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401)); // Throw custom error
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Find the admin by id from the decoded token
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return next(new AppError('User no longer exists', 401)); // Throw custom error
    }

    // If the admin isn't a superadmin, check their workplace
    if (admin.role !== "superadmin") {
      let workplace;
      if (admin.workplaceType === "Hospital") {
        workplace = await Hospital.findById(admin.workplaceId);
      } else if (admin.workplaceType === "BloodBank") {
        workplace = await BloodBank.findById(admin.workplaceId);
      } else {
        return next(new AppError('Invalid workplace type', 400)); // Throw custom error
      }

      // If workplace doesn't exist, throw an error
      if (!workplace) {
        return next(new AppError('Your workplace no longer exists', 404)); // Throw custom error
      }
    }

    // Add admin info to request object for use in later routes
    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      workplaceType: admin.workplaceType,
      workplaceId: admin.workplaceId,
    };

    // Move to the next middleware
    next();
  }
  catch(err){
    return next(new AppError("Error in admin protect", 500, error));
  }
};
