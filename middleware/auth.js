const catchAsyncError = require("../controller/catchAsyncError");
const ErrorHander = require("../utils/errorHanler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHander("Please login to access this resource", 401));
  }

  const deCodeData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(deCodeData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
