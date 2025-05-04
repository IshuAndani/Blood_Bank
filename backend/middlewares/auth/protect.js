const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/Admin');
const { errorResponse } = require('../../utils/errorResponse');
const { jwtSecret } = require('../../config/auth');

// Verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      console.log("no token for protected route")
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }
    // console.log(token);
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // console.log(decoded);
    
    // Find the admin by id from token
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists' 
      });
    }
    
    // Add admin info to request object
    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      workplaceType: admin.workplaceType,
      workplaceId: admin.workplaceId
    };
    
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error.message);
    return errorResponse(res, 401, 'Not authorized to access this route', error.message);
  }
};