const { ApiError } = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode;
  let message = err.message || "Internal server error";

  res.status(statusCode).json({
    sucess: false,
    message,
    errors: err.errors || [],
  });
};

module.exports = { errorHandler };
