const { getWorkplaceIdFromRequest } = require('../utils/helpers');
const { errorResponse } = require('../utils/errorResponse');

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
        if (req.admin.workplace && req.admin.workplace.toString() === workplaceId) {
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