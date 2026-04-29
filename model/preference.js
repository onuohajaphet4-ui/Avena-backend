// models/preference.js

import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  lookingFor: {
    type: String,
    enum: ["Man", "Woman", "Everyone"],
    default: "Everyone"
  },

  relationshipType: {
    type: String,
    enum: ["Monogamy", "Open relationship", "Marriage minded", "Serious dating",  "Casual connection" ,"Still figuring it out"],
    default: "Still figuring it out"
  },

  interests: {
    type: [String],
    default: []
  },

  personalityAnswers: {
    type: [
      {
        question: String,
        answer: String
      }
    ],
    default: []
  },

  personalityType: {
    type: String
  },

  ageRangeMin: {
    type: Number,
    default: 18,
    min: 18
  },

  ageRangeMax: {
    type: Number,
    default: 35,
    max: 100
  }

}, { timestamps: true });
export const Preference = mongoose.model("Preference", preferenceSchema);