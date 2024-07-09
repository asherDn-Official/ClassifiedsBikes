const sendToken = (user, statusCode, res) => {
  //Creating JWT Token
  console.log("userNew");
  const token = user.getJwtToken();

  console.log(token);
  //Setting Cookies
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
