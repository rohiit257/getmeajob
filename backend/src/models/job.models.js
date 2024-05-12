import mongoose from "mongoose";

const {Schema} = mongoose

const jobSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["On Site","Remote","Internship"],
        required:true
    },
    companyname:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    expired:{
        type:Boolean,
        default:false
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true

    }


},{timestamps:true})

export const Job = mongoose.model("Job",jobSchema)