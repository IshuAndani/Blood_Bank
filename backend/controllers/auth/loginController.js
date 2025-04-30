const { Admin } = require('../../models/Admin');
const { comparePassword } = require('../../utils/passwordUtils');
const { cleanString } = require('../../utils/cleanString');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { generateToken } = require('../../utils/generateToken');

// Login controller
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = cleanString(email).toLowerCase(); // Clean email input
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT payload
    const payload = {
      id: admin._id,
      role: admin.role,
      workplace: admin.workplace
    };

    // Generate token
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `Bearer ${token}`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        workplace: admin.workplace
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return errorResponse(res, 500, 'Error during login', error.message);
  }
};
