const express = require("express");
const {
  newAddress,
  updateAddress,
  getAllAddress,
  getAddressUser,
  deleteAddress,
} = require("../controller/addressController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/address/new").post(isAuthenticateUser, newAddress);
router.route("/address/my/").get(isAuthenticateUser, getAddressUser);
router
  .route("/address/:id")
  .put(isAuthenticateUser, updateAddress)
  .delete(isAuthenticateUser, deleteAddress);
router
  .route("/address/")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllAddress);

module.exports = router;
