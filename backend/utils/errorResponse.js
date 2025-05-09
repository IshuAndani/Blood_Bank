exports.errorResponse = (res, statusCode, message, error = null) => {
  if(error) console.error(error);
  console.log(message);
  const response = {
    success: false,
    message : message || error.message,
  };

  if (error) {
    response.error = error; // add error details only if provided
  }

  return res.status(statusCode).json(response);
};
