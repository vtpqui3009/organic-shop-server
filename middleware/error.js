const ErrorHander = require("../utils/errorHanler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongodb Id
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHander(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHander(message, 400);
  }

  //Wrong jsonwebtoken error
  if (err.code === "JsonWebTokenError") {
    const message = `Json web token is Invalid, try again`;
    err = new ErrorHander(message, 400);
  }

  //jwt expire error
  if (err.code === "TokenExpiredError") {
    const message = `Json web token is Expired, try again`;
    err = new ErrorHander(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
