const { Admin } = require('../../models/Admin');
const { Hospital } = require('../../models/Hospital');
const { BloodBank } = require('../../models/BloodBank');
const { transporter } = require('../../utils/nodemailer');
const { generateRandomPassword } = require('../../utils/passwordUtils');
const { default: mongoose } = require('mongoose');

// Helper: Validate if requester is allowed to create the given role
const isRoleValidForRequester = (role, requesterRole) => {
  if (requesterRole === 'superadmin') {
    return ['headadmin', 'admin'].includes(role);
  }
  if (requesterRole === 'headadmin') {
    return role === 'admin';
  }
  return false;
};

// Helper: Get and validate workplace
const validateWorkplaceForSuperadmin = async (workplaceId, workplaceType) => {
  let workplace;
  if (workplaceType === 'BloodBank') {
    workplace = await BloodBank.findById(workplaceId);
  } else if (workplaceType === 'Hospital') {
    workplace = await Hospital.findById(workplaceId);
  } else {
    const err = new Error('Invalid workplace type. Must be either BloodBank or Hospital.');
    err.statusCode = 400;
    throw err;
  }

  if (!workplace) {
    const err = new Error('Workplace not found.');
    err.statusCode = 404;
    throw err;
  }

  return workplace;
};

// POST /api/auth/register
exports.registerEmployee = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, email, role: rawRole, workplaceType, workplaceId } = req.body;
    const requester = req.admin;

    if (!name || !email) {
      const err = new Error('Name and email are required.');
      err.statusCode = 400;
      throw err;
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const err = new Error('Email already in use.');
      err.statusCode = 400;
      throw err;
    }

    let role = rawRole;
    if (!isRoleValidForRequester(role, requester.role)) {
      const err = new Error(`You are not authorized to create ${role}s.`);
      err.statusCode = 403;
      throw err;
    }

    let workplace;
    if (requester.role === 'superadmin') {
      if (!workplaceId || !workplaceType) {
        const err = new Error('WorkplaceId and WorkplaceType must be provided by superadmin.');
        err.statusCode = 400;
        throw err;
      }
      workplace = await validateWorkplaceForSuperadmin(workplaceId, workplaceType);
    } else if (requester.role === 'headadmin') {
      role = 'admin'; // force role to admin
      workplace = requester.workplaceType === 'BloodBank'
        ? await BloodBank.findById(requester.workplaceId)
        : await Hospital.findById(requester.workplaceId);

      if (!workplace) {
        const err = new Error('Workplace not found.');
        err.statusCode = 404;
        throw err;
      }
    } else {
      const err = new Error('You are not authorized to create employees.');
      err.statusCode = 403;
      throw err;
    }

    const assignedWorkplace = requester.role === 'superadmin'
      ? workplace._id
      : requester.workplaceId;

    const password = generateRandomPassword(10);
    console.log(password);

    await transporter.sendMail({
      from: `"Blood Bank App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Admin Login Password',
      text: `Hello ${name},\n\nYou have been registered as an admin.\nYour login password is: ${password}\nPlease log in and change your password.`,
    });

    const newAdmin = new Admin({
      name,
      email,
      password,
      role,
      workplaceType: workplace.constructor.modelName,
      workplaceId: assignedWorkplace,
    });

    await newAdmin.save({ session });

    workplace.employees[role].push(newAdmin._id);
    await workplace.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'Employee registered successfully.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        workplaceId: newAdmin.workplaceId,
        workplaceType: newAdmin.workplaceType
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Ensure error has a statusCode for the middleware
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = error.message || 'Internal Server Error';
    }

    return next(error); // Pass error to centralized error middleware
  }
};
