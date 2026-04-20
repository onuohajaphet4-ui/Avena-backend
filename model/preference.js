// models/preference.js

import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  
  lookingFor: {
    type: String
  },

  relationshipType: {
    type: String,
    default: "Friendship"
  },

  interests: [{
    type: String
  }],

  personalityAnswers: [{
    question: String,
    answer: String
  }],

  personalityType: {
    type: String
  },

  
  ageRangeMin: {
    type: Number,
    default: 18
  },

  ageRangeMax: {
    type: Number,
    default: 35
  }


},
{
  timestamps: true
});

export const Preference = mongoose.model("Preference", preferenceSchema);