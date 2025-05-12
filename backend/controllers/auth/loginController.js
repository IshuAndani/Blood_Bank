const { Admin } = require('../../models/Admin');
const { comparePassword } = require('../../utils/passwordUtils');
const { cleanString } = require('../../utils/cleanString');
const { generateToken } = require('../../utils/generateToken');
const { AppError } = require('../../utils/error.handler');
const { sendResponse } = require('../../utils/response.util');
const { asyncHandler } = require('../../utils/asyncHandler');
const validator = require('validator');

exports.login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('All fields are required', 400);
  }

  email = cleanString(email).toLowerCase();
  if(!validator.isEmail(email)) throw new AppError('Invalid email format', 400);

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = {
    id: admin._id,
    role: admin.role,
    workplaceType: admin.workplaceType,
    workplaceId: admin.workplaceId
  };

  const token = generateToken(payload);

  return sendResponse(res, 200, true, 'Login successful', {
    token: `Bearer ${token}`,
    adminId: admin._id,
    role: admin.role,
    workplaceId: admin.workplaceId,
    workplaceType: admin.workplaceType
  });
});
