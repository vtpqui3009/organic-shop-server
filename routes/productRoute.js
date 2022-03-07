const express = require("express");
const {
  getAllProducts,
  getAllProductsNew,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  updateProductReview,
  getAllProductReviews,
  deleteReviews,
  getCategory,
} = require("../controller/productController");

const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/all").get(getAllProductsNew); // update this line
router.route("/category").get(getCategory);
router.route("/product/:id").get(getProductDetails);
router
  .route("/admin/product/new")
  .post(isAuthenticateUser, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct);
router.route("/review").put(createProductReview);
router.route("/edit/review/:id").put(updateProductReview);
router
  .route("/reviews")
  .get(getAllProductReviews)
  .delete(isAuthenticateUser, deleteReviews);

module.exports = router;
