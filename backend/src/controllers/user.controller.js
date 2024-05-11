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
        role
    });

   
    const createduser = await User.findById(user._id).select("-password")

    if(!createduser){
        throw new ApiError(404,"there error while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    );
});

export {
    registerUser
};
