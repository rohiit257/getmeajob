export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  
  // Cookie options
  const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Expires in days set by environment variable
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: 'Lax', // Helps mitigate CSRF attacks
  };

  res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      message,
      token,
  });
};
