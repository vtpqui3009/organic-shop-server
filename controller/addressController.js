const Address = require("../models/addressModel");
const ApiFeature = require("../utils/apiFeature");
const ErrorHander = require("../utils/errorHanler");
const catchAsyncError = require("./catchAsyncError");

//create address
exports.newAddress = catchAsyncError(async (req, res, next) => {
  const username = req.user.name;
  req.body.user = username;

  const newAddress = await Address.create(req.body);

  res.status(200).json({
    success: true,
    newAddress,
  });
});

//get all address-admin

exports.getAllAddress = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const addressCount = await Address.countDocuments();

  const apiFeature = new ApiFeature(Address.find(), req.query).pagination(
    resultPerPage
  );
  const addresss = await apiFeature.query;
  res.status(200).json({
    success: true,
    addresss,
    addressCount,
  });
});

//get address-user
exports.getAddressUser = catchAsyncError(async (req, res, next) => {
  const user = req.user.name;

  const address = await Address.find({ user });
  if (!address) {
    return next(new ErrorHander("Address not found", 404));
  }
  res.status(200).json({
    success: true,
    address,
  });
});

//update address
exports.updateAddress = catchAsyncError(async (req, res, next) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return next(new ErrorHander("Address not found", 404));
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    address,
  });
});

//delete address
exports.deleteAddress = catchAsyncError(async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  if (!address) {
    return next(new ErrorHander("Address not found", 404));
  } else {
    await address.remove();
    res.status(200).json({
      success: true,
      message: "Address has been deleted",
    });
  }
});
