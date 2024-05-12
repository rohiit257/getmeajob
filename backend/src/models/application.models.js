import mongoose , {Schema} from "mongoose";

const applicationSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    resume:{
        public_id:{
            type:String,
            required:false
        },
        url:{
            type:String,
            required:false
        }
    },
    applicantId:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["JobSeeker"],
            required:true
        }
    },
    employerId:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["Employer"],
            required:true
        }
    }


},{timestamps:true})

export const Application = mongoose.model("Application",applicationSchema)