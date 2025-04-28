const { errorResponse } = require('../../utils/errorResponse');

exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (allowedRoles.includes(req.admin.role)) {
        return next();
      }
      console.error(`Access denied: ${allowedRoles.join('/')} role required`);
      return errorResponse(res, 403, 'Access denied: You do not have the required role to access this resource');
    };
};
  