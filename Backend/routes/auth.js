const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const {
  registerUser,
  loginuser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  otpVerify,
} = require("../controllers/authController");

const {
  isAuthenticateUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

const router = express.Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/verify").post(upload.single("avatar"), otpVerify);
router.route("/login").post(loginuser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticateUser, getUserProfile);
router.route("/password/change").put(isAuthenticateUser, changePassword);
router
  .route("/update")
  .put(isAuthenticateUser, upload.single("avatar"), updateProfile);

// Admin Routes

router
  .route("/admin/users")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticateUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
