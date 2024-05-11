import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validate from "validator"

const userSchema = new Schema({
    name:{
        typeof:String,
        required:true,
    },
    email:{
        typeof:String,
        required:true,
    },
    phonenumber:{
        typeof:Number,
        required:true
    },
    password:{
        typeof:String,
        required:true
    },
    role:{
        typeof:String,
        required:true,
        enum:['JobSeeker','Employer']
    }
    
},{timestamps:true}
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };
  
  export const User = mongoose.model("User", userSchema);