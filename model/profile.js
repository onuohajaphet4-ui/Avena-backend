// models/profile.js

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  
  name: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  phone: {
    type: String
  },

  
  bio: {
    type: String,
    maxlength: 300
  },

  
  prompt:{
    type: String
  },


  photos: [{
    type: String
  }],

 
  
},
{
  timestamps: true
});

export const Profile = mongoose.model("Profile", profileSchema);