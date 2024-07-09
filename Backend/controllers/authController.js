const mongoose = require("mongoose");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/EMAIL.JS");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const { sendMail } = require("./SendMail");
const jwt = require("jsonwebtoken");
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Register User - /api/v1/register
// exports.otpVerify = catchAsyncError(async (req, res, next) => {
//   const { otp } = req.body;

//   const userCookie = req.cookies.token;

//   jwt.verify(userCookie, process.env.JWT_SECRET, async (err, token) => {
//     console.log("token", token);
//     if (err) {
//       console.error("Token is Not Valid", err.message);
//       res.status(500).send("Token Verification Failed");
//     }

//     try {
//       const tokenuser = token.user;
//       const user = await User.findOne({ email: tokenuser.email }).select(
//         "+password"
//       );

//       if (user) {
//         console.error("User Already Exists", err.message);
//         res.status(500).send("User Already Exists");
//       }

//       if (String(token.otp) === otp) {
//         const user = await User.findOneAndUpdate(
//           { email: token.email },
//           {
//             verified: true,
//           }
//         );
//         sendToken(user, 201, res);
//         res.status(200).send("success");
//       } else {
//         res.status(500).send("failed");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   // let avatar;

// let BASE_URL = process.env.BACKEND_URL;
// if (process.env.NODE_ENV === "production") {
//   BASE_URL = `${req.protocol}://${req.get("host")}`;
// }
//   // if (req.file) {
//   //   avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
//   // }
// });
exports.otpVerify = catchAsyncError(async (req, res, next) => {
  const { otp } = req.body;
  const userCookie = req.cookies.token;

  jwt.verify(userCookie, process.env.JWT_SECRET, async (err, token) => {
    if (err) {
      console.error("Token is Not Valid", err.message);
      return res.status(500).send("Token Verification Failed");
    }

    try {
      // console.log("TokenRanjth", token);
      const user = await User.findOne({ email: token.email });
      if (user) {
        // console.error("User not found");
        return res.status(404).send("User not found");
      }
      // console.log("verified", user.verified, typeof user.verified);
      // console.log("otp", otp, typeof otp);
      if (String(token.otp) === otp) {
        // Compare user's stored OTP with the provided OTP
        // const updatedUser = await User.findOneAndUpdate(
        //   { email: user.email },
        //   { verified: "true" }
        // );
        const updatedUser = await User.create({
          name: token.name,
          email: token.email,
          password: token.password,
          // verified: otp,
        });
        // console.log("success");
        sendToken(updatedUser, 201, res);
      } else {
        // console.log("fail");
        res.status(200).send("fail");
      }
    } catch (error) {
      console.error("Internal Server Error:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});

// exports.registerUser = catchAsyncError(async (req, res, next) => {
//   const { name, email, password } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   const content = `

//   <div>
//   OTP: ${otp}

//   </div>
//   `;
//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   const updatedUser = { ...user, otp: otp };

//   console.log(updatedUser);

//   // user.Append({ otp: otp });

//   sendMail(email, "OTP", content);
//   sendToken(updatedUser._doc, 201, res);
// });

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  const user = {
    name,
    email,
    password,
    otp,
  };

  if (!(password.length >= 8 && password.length <= 12)) {
    // const errorSchema = new mongoose.Schema({
    //   error: {
    //     type: String,
    //     required: [true, "Helllo"],
    //   },
    // });
    // let modelError = mongoose.model("Error", errorSchema);

    // const newError = new modelError({});

    return res.status(500).json({
      success: false,
      message: "Password Must be Above 8 and Below 12 ",
    });
  }

  const exisitingUser = await User.findOne({ email: email });

  if (exisitingUser) {
    // console.log("uSERLengthError");
    return res.status(500).json({
      success: false,
      message: "User Already Exist",
    });
  }

  const content = `
  <div>
  OTP: ${otp}
  </div>
  `;
  // const user = await User.create({
  //   name,
  //   email,
  //   password,
  //   verified: otp,
  // });

  // const updatedUser = { ...user, otp: otp };
  // user._doc.otp = otp;
  // console.log("userData", user);
  // user.Append({ otp: otp });
  sendMail(email, "OTP", content);

  // sendToken(user, 201, res);

  // const token = user.getJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const jwtfinaltoken = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });

  // const user = {
  //   name: "login",
  //   email: "",
  //   password: "",
  // };

  res.status(200).cookie("token", jwtfinaltoken, options).json({
    success: true,
    jwtfinaltoken,
    user,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Login User - /api/v1/login
exports.loginuser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password", 400));
  }
  ///Finding The User Database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 201, res);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Logut - /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      sucess: true,
      message: "Logged Out",
    });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Forgot Password - /api/v1/password/forgot
// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorHandler("User not Found with this email", 404));
//   }
//   const resetToken = user.getResetToken();
//   await user.save({ validateBeforeSave: false });

//   // Create Reset URL
//   const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

//   const message = `Your password reset URL is as follow \n\n
//   ${resetUrl} \n\n If you have not requested this email, then ignore it`;

//   try {
//     sendEmail({
//       email: user.email,
//       subject: "REVNITRO Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       sucess: true,
//       message: `Email sent to ${user.email}`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordTokenExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(new ErrorHandler(error.message), 500);
//   }
// });
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not Found with this email", 404));
  }
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });
  // Create Reset URL

  let BASE_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;
  const message = `Your password reset URL is as follow \n\n
  ${resetUrl} \n\n If you have not requested this email, then ignore it`;
  try {
    sendMail(user.email, "REVNITRO Password Recovery", message);

    res.status(200).json({
      sucess: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Reset Password - /api/v1/password/reset/:token

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or expired"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't Match"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Get User Profile - /api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Change Password - /api/v1/password/change

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //  check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  //  Assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Update Profile - /api/v1

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.originalname}`;
    newUserData = { ...newUserData, avatar };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  Admin : Get All Users - /api/v1/admin/users

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    sucess: true,
    users,
  });
});

//  Admin : Get Specific User - /api/v1/admin/user/:id

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not Found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    sucess: true,
    user,
  });
});

//  Admin : Update User  - /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//  Admin : Delete User  - /api/v1/admin/user/:id

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not Found with this id ${req.params.id}`)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
