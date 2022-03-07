const express = require("express");
const {
  newBlog,
  getAllBlog,
  getAllBlogNew,
  updateBlog,
  getDetailBlog,
  deleteBlog,
  createComment,
  updateCommnet,
  deleteCommnet,
  getAllBlogComment,
} = require("../controller/blogController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/blogs").get(getAllBlog);
router.route("/blogs/all").get(getAllBlogNew);
router
  .route("/blog/:id")
  .get(getDetailBlog)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteBlog);

router
  .route("/blog/new")
  .post(isAuthenticateUser, authorizeRoles("admin"), newBlog);
router
  .route("/blog/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateBlog);
router
  .route("/comments")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllBlogComment);
router.route("/blog/comment/new").post(isAuthenticateUser, createComment);
router.route("/blog/comment/update").put(isAuthenticateUser, updateCommnet);
router.route("/blog/comment/delete").delete(isAuthenticateUser, deleteCommnet);

module.exports = router;
