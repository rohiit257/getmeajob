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

const getallJobs = asyncHandler(async(_,res)=>{

    const jobs = await Job.find({isExpired:false})
    if (!jobs){
        throw new ApiError(400,"No Jobs Available At This Moment")
    }
    return res.status(201).json(
        new ApiResponse(200,jobs)
    )

})

const getmyJobs = asyncHandler(async(req,res)=>{
    const {role} =  req.user
    if(role === "JobSeeker"){
        throw new ApiError(404,"You Have No Access To This Resource")
    }

    const myjobs = await Job.find({postedBy: req.user._id})
    if(!myjobs){
        throw new ApiError(400,"You Havent Posted Any Jobs Yet")
    }

    return res.status(201).json(
        new ApiResponse(200,myjobs)
    )
})

const updateJob = asyncHandler(async(req,res)=>{
    const {role} =  req.user
    if(role === "JobSeeker"){
        throw new ApiError(404,"You Have No Access To This Resource")
    }

    const {id} = req.params
    const{title,
        description,
        category,
        type,
        companyname,
        country,
        city,
        salary,
        isExpired,
        postedBy} = req.body

    let job = await Job.findById(id)
    if(!job){
        throw new ApiError(404,"Job Not Found")
    }

    job = await Job.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })



    return res.status(201).json(
        new ApiResponse(200,job,"Job Updated Sucessfully")
    )

})

const getJobById = asyncHandler(async(req,res)=>{
    const {id} = req.params

    const job = await Job.findById(id)

    if(!job){
        throw new ApiError(404,"Invalid Job Id")
    }

    return res.status(201).json(
        new ApiResponse(200,job)

    )
})



export {
    postJob,
    getallJobs,
    getmyJobs,
    updateJob,
    getJobById
}