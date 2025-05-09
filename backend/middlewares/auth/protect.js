const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/Admin');
const { errorResponse } = require('../../utils/errorResponse');
const { jwtSecret } = require('../../config/auth');
const { Hospital } = require('../../models/Hospital');
const { BloodBank } = require('../../models/BloodBank');

// Verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("token = " , token);
    }
    
    if (!token) {
      console.log("no token for protected route")
      return errorResponse(res,401,'Not authorized to access this route');
    }
    // console.log(token);
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log("decode = ",decoded);
    
    // Find the admin by id from token
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return errorResponse(res,401,"User no longer exist");
    }
    if(admin.role !== "superadmin"){
      if(admin.workplaceType === "Hospital"){
        workplace = await Hospital.findById(admin.workplaceId);
      }
      else if(admin.workplaceType ==="BloodBank"){
        workplace = await BloodBank.findById(admin.workplaceId);
      }
      else{
        throw Error("Invalid workplace Type");
        // errorResponse(res,404,"Invalid workplace Type");
      }
      if(!workplace){
        throw Error("Your workplace no longer exist");
        // return next();
        // errorResponse(res,404,"Your workplace no longer exist");
      }
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