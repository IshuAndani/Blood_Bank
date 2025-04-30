const { Admin } = require('../../models/Admin');
const { BloodBank } = require('../../models/BloodBank');
const { errorResponse } = require('../../utils/errorResponse');
const { toObjectId } = require('../../utils/helpers');
const { asyncHandler } = require('../../utils/asyncHandler');

// Helper function to check if role is valid
const isRoleValidForRequester = (role, requesterRole) => {
  if (requesterRole === 'superadmin') {
    return ['headadmin', 'admin', 'observer'].includes(role);
  } else if (requesterRole === 'headadmin') {
    return ['admin', 'observer'].includes(role);
  }
  return false;
};

// Helper function to validate workplace for superadmin
const validateWorkplaceForSuperadmin = async (workplace) => {
  const bank = await BloodBank.findById(workplace);
  if (!bank) {
    throw new Error('Blood Bank not found.');
  }
  return bank;
};

// POST /api/auth/register
exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, password, role, workplace } = req.body;
    const requester = req.admin; // Fetched from protect middleware (logged in admin)

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    }

    // Validate email uniqueness
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    let bank;
    // Validate role permissions
    if (!isRoleValidForRequester(role, requester.role)) {
      return res.status(403).json({ success: false, message: `You are not authorized to create ${role}s.` });
    }

    if (requester.role === 'superadmin') {
      if (!workplace) {
        return res.status(400).json({ success: false, message: 'Workplace (blood bank) must be provided by superadmin.' });
      }
      bank = await validateWorkplaceForSuperadmin(workplace);
    } else if (requester.role === 'headadmin') {
      bank = await BloodBank.findById(requester.workplace);
      if (!bank) {
        return res.status(404).json({ success: false, message: 'Blood Bank not found.' });
      }
    } else {
      return res.status(403).json({ success: false, message: 'You are not authorized to create employees.' });
    }

    // Set workplace
    const assignedWorkplace = requester.role === 'superadmin' ? workplace : requester.workplace;

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password, 
      role,
      workplace: assignedWorkplace,
    });

    await newAdmin.save();

    // Add new employee to the workplace
    bank.employees[role].push(newAdmin._id); 
    await bank.save();

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        workplace: newAdmin.workplace,
      },
    });

  } catch (error) {
    console.error('Error in registerEmployee:', error.message);
    return errorResponse(res, 500, 'Error in registerEmployee', error.message);
  }
};
