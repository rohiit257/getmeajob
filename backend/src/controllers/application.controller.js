import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "cloudinary"
import { Job } from "../models/job.models.js";
import { Application } from "../models/application.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

const postApplication = asyncHandler(async(req,res)=>{

    const {role} = req.user
    if(role === "Employer"){
        throw new ApiError(400,"You Cant Post For A job")
    }

    // if(!req.files ||  Object.keys(req.files).length === 0 ){
    //     throw new ApiError(400,"Resume File Required")

    // }
    // const {resume} =  req.files
    // const allowedFormats = ["image/png","image/jpeg","image/webp"]
    // if(!allowedFormats.includes(resume.mimetype)){
    //     throw new ApiError(400,"Resume Should Be In Png or Jpg or Webp Format")
    // }

    // const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath)

    // if(!cloudinaryResponse || cloudinaryResponse.error){
    //     console.log('====================================');
    //     console.log(cloudinaryResponse.error);
    //     console.log('====================================');
    //     throw new ApiError(400,"cloudinary error")
    // }
    const { name, email, coverLetter, phone, jobId } = req.body;
    const applicantId = {
        user : req.user._id,
        role:"JobSeeker"
    }

    

    // if(!jobId){
    //     throw new ApiError(400,"Job Doesnt Exist")
    // }

    const jobDetails = await Job.findById({_id:jobId})
    if(!jobDetails){
        throw new ApiError(404,"Job Doesnt Exist ")
    }
    const employerId = {
        user: jobDetails.postedBy,
        role: "Employer",
    }
    if (
        !name ||
        !email ||
        !coverLetter ||
        !phone ||
        !applicantId ||
        !employerId
      ){throw new ApiError(400,"All Fields Are Required")}

    const application = await Application.create({
        name,
        email,
        phone,
        coverLetter,
        applicantId,
        employerId,
        // resume:{
        //     public_id: cloudinaryResponse.public_id,
        //     url: cloudinaryResponse.secure_url,
        // }

    })

    if(!application){
        throw new ApiError(404,"application not created")
    }

    return res.status(201)
    .json(new ApiResponse(200,application,"application submitted "))

})



export {postApplication}