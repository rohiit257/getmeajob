import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const registerUser = asyncHandler(async(req,res)=> {
    const {name,email,phonenumber,password,role} = req.body

    if(!name || !email || !phonenumber || !password ||!role){
        throw new ApiError(400,"All Field Are Required")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(401,"user already exits")
    }

    const user = await User.create({
        name,
        email,
        phonenumber,
        password,
        role
    })

    if(!user){
        throw new ApiError(404,"user not created")
    }

    sendToken(user, 201, res, "User Registered!");


})


export {
    registerUser
}