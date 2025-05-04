const { Admin } = require('../../models/Admin');
const { Hospital } = require('../../models/Hospital');
const { BloodBank } = require('../../models/BloodBank');
const { errorResponse } = require('../../utils/errorResponse');
const { toObjectId } = require('../../utils/helpers');
const { asyncHandler } = require('../../utils/asyncHandler');

// Helper function to check if role is valid
const isRoleValidForRequester = (role, requesterRole) => {
  if (requesterRole === 'superadmin') {
    return role && ['headadmin', 'admin'].includes(role);
  } else if (requesterRole === 'headadmin') {
    return true;
  }
  return false;
};

// Helper function to validate workplace for superadmin
const validateWorkplaceForSuperadmin = async (workplaceId, workplaceType) => {
  let workplace;
  if(workplaceType === 'BloodBank'){
    workplace = await BloodBank.findById(workplaceId);
  }
  else if (workplaceType === 'Hospital'){
    workplace = await Hospital.findById(workplaceId);
  }
  else{
    throw new Error('Invalid workplace type. Must be either BloodBank or Hospital.');
    // errorResponse(res, 400, 'Invalid workplace type. Must be either BloodBank or Hospital.');
  }
  if (!workplace) {
    throw new Error('Workplace not found.');
  }
  return workplace;
};

// POST /api/auth/register
exports.registerEmployee = async (req, res) => {
  try {
    let { name, email, password, role, workplaceType, workplaceId } = req.body;
    const requester = req.admin; // Fetched from protect middleware (logged in admin)

    // Validate required 
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, password are required.' });
    }

    // Validate email uniqueness
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Validate role permissions
    if (!isRoleValidForRequester(role, requester.role)) {
      return res.status(403).json({ success: false, message: `You are not authorized to create ${role}s.` });
    }

    let workplace;
    if (requester.role === 'superadmin') {
      if (!workplaceId || !workplaceType) {
        errorResponse(res, 400, 'WorkplaceId and WorkplaceType must be provided by superadmin.');
        // return res.status(400).json({ success: false, message: 'WorkplaceId and WorkplaceType must be provided by superadmin.' });
      }
      workplace = await validateWorkplaceForSuperadmin(workplaceId, workplaceType);
    } else if (requester.role === 'headadmin') {
      role = "admin";
      if(requester.workplaceType === 'BloodBank'){
        workplace = await BloodBank.findById(requester.workplaceId);
      }
      else if(requester.workplaceType === 'Hospital'){
        workplace = await Hospital.findById(requester.workplaceId);
      }
      else{
        errorResponse(res, 400, 'Invalid workplace type. Must be either BloodBank or Hospital.');
      }
      if (!workplace) {
        errorResponse(res, 404, 'Workplace not found.');
        // return res.status(404).json({ success: false, message: 'workplace not found.' });
      }
    } else {
      errorResponse(res, 403, 'You are not authorized to create employees.');
      // return res.status(403).json({ success: false, message: 'You are not authorized to create employees.' });
    }

    // Set workplace
    const assignedWorkplace = requester.role === 'superadmin' ? workplace._id : requester.workplaceId;

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password, 
      role,
      workplaceType: workplace.constructor.modelName,
      workplaceId: assignedWorkplace,
    });

    await newAdmin.save();

    // Add new employee to the workplace
    workplace.employees[role].push(newAdmin._id); 
    await workplace.save();

    res.status(201).json({
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
    console.error('Error in registerEmployee:', error.message);
    return errorResponse(res, 500, 'Error in registerEmployee', error.message);
  }
};
