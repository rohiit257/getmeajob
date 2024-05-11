import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ApiError(404,"User Not Authorized")
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});