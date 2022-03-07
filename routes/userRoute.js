const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSigleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticateUser, getUserDetails);
router.route("/me/update").put(isAuthenticateUser, updateProfile);
router.route("/password/update").put(isAuthenticateUser, updatePassword);
router
  .route("/admin/users")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getSigleUser)
  .put(isAuthenticateUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
