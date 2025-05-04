const {errorResponse} = require('../utils/errorResponse');

exports.errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    errorResponse(res,statusCode,message);
    // res.status(statusCode).json({
    //     success: false,
    //     message,
        // Optionally include stack in development only
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    // });
};
  