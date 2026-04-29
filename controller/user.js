import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {user} from "../model/user.js"
import { Profile } from "../model/profile.js";
import { Preference } from "../model/preference.js";

import crypto from "crypto"


//Register
export const creatUser  = async (req, res) => {
    const{
       email,password
    } = req.body


    try {

         //check if emaill exist//
            const exist = await user.findOne({email})
            if (exist) return res.status(400).json({message:"Email Already Exist"})
        

         //Hash password//
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(password, salt);

        //create user
              const users = await user.create({
                email,password:hashPassword,}) 

                 const token = jwt.sign(
                      {id:users._id
                      },
                      process.env.SECRET_KEY,
                      {expiresIn: "7d"}
                  )


                return res.status(201).json ({
                message: 'Registration Was Succesfful', users,token
                })

    } catch (error) {
         console.error(error)
        res.status(500).json ({
            message:'Server Error', error
        })
    }
}


//Login
  export const loginUsers = async (req, res) => {
      const{email, password}  = req.body 
  
      try {
          //check user exist
          const users = await user.findOne({email})
          if(!users) return res.status(400).json({message: 'invalid Email'})
  
              //check if password is correct
              const isMatch = await  bcrypt.compare(password, users.password)
              if (!isMatch) return res.status(400).json({message:'incorrect password'})

                
                
                  const token = jwt.sign(
                      {id:users._id
                      },
                      process.env.SECRET_KEY,
                      {expiresIn: "7d"}
                  )
  
               res.status(200).json({message:'Login successful', token, 
                  user:{
                      id: users._id,
                      email: users.email ,
                  }
               })   
  
      } catch (error) {
          res.status(500).json({message:error.message})
          
      }
     }



 //Get all user//
export const getAllUser = async (req, res) => {
        try {
            let users = await user.find().select('-password')
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({message:"Sever Error", error})
        }
}

 
export const getUserById = async (req, res) => {

  try {

    const userId = req.params.id;

    const foundUser = await user.findById(userId);

    const profile = await Profile.findOne({
      userId,
    });

    const preference = await Preference.findOne({
      userId,
    });

    if (!foundUser) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    res.status(200).json({

      user: foundUser,

      profile,

      preference,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};


//delete user
     export const deleteUser  = async (req, res) => {
    try {
        const id  = req.params.id
        const users = await user.findByIdAndDelete(id)
        if(!users) return res.status(400).json({message: 'user do not exist'}) 
        res.status(201).json({message: 'user deleted successful'})
        await user.deleteOne ()
          
    } catch (error) {
        res.status(500).json({message:"Sever Error", error})
    }
  }

//Update Users  //
    export const updateUser = async (req, res) => { 
        let userId =req.params.id 
        const{
            email,
            
        } = req.body

        try {
            let users = await user.findByIdAndUpdate(userId)
              if(!users) return res.status(404).json({message: 'users Not Found'})
             

          // update only provided fields //
            users.email= email || users.email
            
           await users.save()

             res.status(200).json({ success:true,message: 'users succesfully updated', users: {
                id: users._id,
                email: users.email,
                
               
             }

             })

         


        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

 //Request for new password link
 
 export const forgotPassword = async  (req, res) => {
   
    const {email} = req.body

    try {

        const users = await user.findOne({email})
        
        if (!users) {
            return res.json({
                message:'if email exists, reset link sent'
            })
        }


        //Generate token 
        const token = crypto.randomBytes(32).toString("hex")

        //Hash token

        const hashed = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

        // Save token + expiry
       users.resetPasswordToken= hashed
       users.resetPasswordExpires=Date.now() + 15 * 60* 1000
       
       await users.save()


       //create rest link
       const resetUrl= `http://localhost:5134/reset-password/${token}`

    //    console.log("RESET PASSWORD LINK:", resetUrl)

       res.json({message:"Reset link sent",token})

        
    } catch (error) {
        res.status(500).json({message:"error"})
    }
}


// create new password

export const resetPassword = async  (req, res) => {
    try {
        const {token}=req.params
        const {password} = req.body

         //Hash token

        const hashed = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

        const users = await user.findOne({
            resetPasswordToken:hashed,
            resetPasswordExpires:{ $gt:Date.now() }
        })

        if (!users){
              return res.status(400).json({
                message:'invalid token'
            })
        }

        
         //Hash password//
              const salt = await bcrypt.genSalt(10);
              users.password = await bcrypt.hash(password, salt);

        users.resetPasswordToken=undefined
        users.resetPasswordExpires=undefined

        await users.save()


          res.json({message:"Password reset successful"})

        
    } catch (error) {
        res.status(500).json({message:"error"})
    }

}

//check if user exist payment
export const userExist  = async (req, res) => {
    const{
        email
    } = req.body

         //check if emaill exist//
            const users = await user.findOne({email})
            if (!users){ return res.status(400).json({exists:false})
            }
        res.json({exists:true})
            
}

