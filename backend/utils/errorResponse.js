exports.errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message,
  };

  if (error) {
    response.error = error; // add error details only if provided
  }

  return res.status(statusCode).json(response);
};
