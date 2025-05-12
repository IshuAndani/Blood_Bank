const { AppError } = require('../../utils/error.handler'); // Custom error class

exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (allowedRoles.includes(req.admin.role)) {
        return next();
      }
      return next(new AppError('Access denied: You do not have the required role to access this resource',403));
      // console.error(`Access denied: ${allowedRoles.join('/')} role required`);
      // return errorResponse(res, 403, 'Access denied: You do not have the required role to access this resource');
    };
};
  