import { Job } from "../models/job.models.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const postJob = asyncHandler(async(req,res)=>{
    const {role} = req.user
    if(role === "JobSeeker"){
        throw new ApiError(401,"JobSeeker Cannot Post A Job")
    }

    const{title,
        description,
        category,
        type,
        companyname,
        country,
        city,
        salary,
        postedBy} = req.body

    if(!title || !description || !category || !type || !companyname || !country || !city){
        throw new ApiError(401,"Please Provide Job Details")
    }
    if(!salary){
        throw new ApiError(401,"Please Provide Salary")
    }
    const userId = req.user._id

    const job = await Job.create({
        title,
        description,
        category,
        type,
        companyname,
        country,
        city,
        salary,
        postedBy:userId

})

    if(!job){
        throw new ApiError(404,"There Some Error While Posting Job Try Again")
    }

    return res.status(201).json(
        new ApiResponse(200,job,"Job Posted Successfully")
    )
})

export {
    postJob
}