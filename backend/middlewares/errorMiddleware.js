const { AppError } = require('../utils/error.handler.js');

const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err); // optionally use a logging lib

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle unexpected errors differently if needed
    if (!err.isOperational) {
        statusCode = 500;
        message = 'Something went wrong!';
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

module.exports = { errorMiddleware };