// utils/errorHandler.js
const handleError = (res, error, statusCode = 500) => {
  console.error('❌ Error:', error.message);
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

module.exports = handleError;
