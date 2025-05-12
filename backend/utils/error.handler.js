class AppError extends Error {
    constructor(message, statusCode, originalError = null) {
        super(message);
        this.statusCode = statusCode || 500;
        this.isOperational = true; // can be used to separate known errors from programming bugs
        if (originalError) this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor);
    }
}
 
module.exports = {AppError};