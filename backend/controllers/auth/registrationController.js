const { Admin } = require('../../models/Admin');
const { Hospital } = require('../../models/Hospital');
const { BloodBank } = require('../../models/BloodBank');
const { transporter } = require('../../utils/nodemailer');
const { generateRandomPassword } = require('../../utils/passwordUtils');
const { AppError } = require('../../utils/error.handler');
const { sendResponse } = require('../../utils/response.util');
const { asyncHandler } = require('../../utils/asyncHandler');
const { cleanString } = require('../../utils/cleanString');
const validator = require('validator');
const mongoose = require('mongoose');

// Helper: Get and validate workplace
const validateWorkplace = async (workplaceId, workplaceType) => {
  if (!['BloodBank', 'Hospital'].includes(workplaceType)) {
    throw new AppError('Invalid workplace type. Must be BloodBank or Hospital.', 400);
  }

  const Model = workplaceType === 'BloodBank' ? BloodBank : Hospital;
  const workplace = await Model.findById(workplaceId);
  if (!workplace) {
    throw new AppError('Workplace not found.', 404);
  }

  return workplace;
};

// POST /api/auth/register
exports.registerEmployee = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { name, email, workplaceType, workplaceId } = req.body;
    const requester = req.admin;

    if (!name || !email) {
      throw new AppError('Name and email are required.', 400);
    }

    email = cleanString(email).toLowerCase();
    if(!validator.isEmail(email)) throw new AppError('Invalid email format', 400);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new AppError('Email already in use.', 400);
    }

    let role;
    let workplace;
    if (requester.role === 'superadmin') {
      if (!workplaceId || !workplaceType) {
        throw new AppError('Workplace ID and type are required for superadmin.', 400);
      }
      workplace = await validateWorkplace(workplaceId, workplaceType);
      role = "headadmin";
    } else{
      role = 'admin'; // Enforce only 'admin' can be created
      workplace = await validateWorkplace(requester.workplaceId, requester.workplaceType);
    }

    // const assignedWorkplace = requester.role === 'superadmin' ? workplace._id : requester.workplaceId;
    const password = generateRandomPassword(10);
    
    await transporter.sendMail({
      from: `"Blood Bank App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Admin Login Password',
      text: `Hello ${name},\n\nYou have been registered as an admin.\nYour login password is: ${password}\nPlease log in and change your password.`
    });

    const newAdmin = new Admin({
      name,
      email,
      password,
      role,
      workplaceType: workplace.constructor.modelName,
      workplaceId: workplace._id
    });

    await newAdmin.save({ session });

    workplace.employees[role].push(newAdmin._id);
    await workplace.save({ session });

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, 201, true, 'Employee registered successfully.', {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      workplaceId: newAdmin.workplaceId,
      workplaceType: newAdmin.workplaceType
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
