import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        
        email:{
            type:String , required:true , unique:true
        },
        password:{
             type:String , required:true 
        },

        isProfileComplete: {
        type:Boolean,
        default:false
        },
        resetPasswordToken: String,
        resetPasswordExpires:Date,
    },{timestamps:true}
)

export const user = mongoose.model("user", userSchema)