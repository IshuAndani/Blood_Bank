const { getWorkplaceIdFromRequest } = require('../utils/helpers');
const { errorResponse } = require('../utils/errorResponse');


exports.canAccessBloodBank = async (req,res,next) => {
    if(req.admin.workplaceType === "BloodBank"){
        next();
    }else{
        console.log(req.admin.workplaceType);
        return errorResponse(res,403,"You cannot access bloodbank");
    }
    
}

exports.canAccessHospital = async (req,res,next) => {
    if(req.admin.workplaceType === "Hospital"){
        next();
    }else{
        console.log(req.admin.workplaceType);
        return errorResponse(res,403,"You cannot access hospital");
    }
    
}

// Check workplace access
exports.canAccessWorkplace = async (req, res, next) => {
    try {
        // Superadmin can access any workplace
        if (req.admin.role === 'superadmin') {
            return next();
        }
        
        // Get workplace ID from request params or body
        const workplaceId = getWorkplaceIdFromRequest(req);
        
        // Check if admin's workplace matches the requested workplace
        if (req.admin.workplaceId && req.admin.workplaceId.toString() === workplaceId) {
        return next();
        }
        
        return res.status(403).json({ 
        success: false, 
        message: 'Access denied: You can only access your assigned workplace' 
        });
    } catch (error) {
      console.error('Error checking workplace access:', error.message);
      return errorResponse(res, 500, 'Error checking workplace access', error.message);
    }
};