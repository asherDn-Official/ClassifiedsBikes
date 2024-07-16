const express = require("express");
const {
  newProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const router = express.Router();

const {
  isAuthenticateUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/product"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/products").get(getProducts);

// router
//   .route("/product/new")
//   .post(isAuthenticateUser, authorizeRoles("admin"), newProduct);

router.route("/product/:id").get(getSingleProduct);

router
  .route("/review")
  .put(isAuthenticateUser, createReview)
  .delete(deleteReview);
router.route("/reviews").get(getReviews);

//  Admin Routes

router
  .route("/admin/product/new")
  .post(
    isAuthenticateUser,
    authorizeRoles("admin"),
    upload.array("images"),
    newProduct
  );

router
  .route("/admin/products")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/:id")
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/product/:id")
  .put(
    isAuthenticateUser,
    authorizeRoles("admin"),
    upload.array("images"),
    updateProduct
  );
module.exports = router;
