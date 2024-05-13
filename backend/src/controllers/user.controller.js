import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { sendToken } from "../utils/jwttoken.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phonenumber, password, role } = req.body;

  if (!name || !email || !phonenumber || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(401, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    phonenumber,
    password,
    role,
  });

  if(!user){
    throw new ApiError(404,"User Not Created")
  }

  const createduser = await User.findById(user._id).select("-password");

  if (!createduser) {
    throw new ApiError(404, "there error while registering user");
  }

  sendToken(createduser,200,res,"User Registered Successfully")

  


});

const loginUser = asyncHandler(async (req, res) => {
  const {email,password,role} = req.body

  if(!email || !password || !role){
    throw new ApiError(401,"field shouldnt be empty")
  }

  const user = await User.findOne({email}).select("+password")
  if(!user){
    throw new ApiError(404,"invalid email")
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect){
    throw new ApiError(404,"incorrect Password")
  }
  if(user.role !== role){
    throw new ApiError(404,"Invalid User Role")
  }

  const loggedInUser = await User.findById(user._id).select("-password")

  sendToken(loggedInUser,200,res,"User LoggedIn succesfully")


});

const logoutUser = asyncHandler(async (_, res) => {
  res.status(201)
  .cookie("token","",{
    httpOnly:true,
    expires:new Date(Date.now())
  })
  .json(new ApiResponse(200,"user logged out successfully"))
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user
  return res.status(201).json(
    new ApiResponse(200,user)
  )
});

export { registerUser, loginUser, logoutUser,getUser };
