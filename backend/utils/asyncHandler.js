exports.asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// This utility function wraps an asynchronous function (like an Express route handler)
// and catches any errors that occur during its execution. 
// If an error occurs, it passes the error to the next middleware in the stack, 
// allowing for centralized error handling. 
// This is particularly useful in Express applications to avoid repetitive try-catch blocks
// in every route handler.

  