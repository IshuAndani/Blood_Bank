const { Admin } = require('../../models/Admin');
const { comparePassword } = require('../../utils/passwordUtils');
const { cleanString } = require('../../utils/cleanString');
const { generateToken } = require('../../utils/generateToken');

// Login controller
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('All fields are required');
      err.statusCode = 400;
      throw err;
    }

    email = cleanString(email).toLowerCase();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      id: admin._id,
      role: admin.role,
      workplaceType: admin.workplaceType,
      workplaceId: admin.workplaceId
    };

    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `Bearer ${token}`,
      adminId: admin._id,
      role: admin.role,
      workplaceId: admin.workplaceId,
      workplaceType: admin.workplaceType
    });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};
