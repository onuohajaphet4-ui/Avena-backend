import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
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

  prompt: {
    type: String
  },

  photos: {
    type: [String],
    default: []
  },

  city: { type: String, default: "" },
  nationality: { type: String, default: "" },
  school: { type: String, default: "" },
  height: { type: String, default: "" },

  zodiac: { type: String, default: "" },

  socialType: { 
    type: String,
    default: ""
  },

  musicTaste: {
    type: [String],
    default: []
  },

  movieTaste: {
    type: [String],
    default: []
  },

  favoriteFood: { type: String, default: "" },
  dreamCountry: { type: String, default: "" },
  firstHangout: { type: String, default: "" },
  greenFlag: { type: String, default: "" },
  redFlag: { type: String, default: "" },

  completionPercentage: {
    type: Number,
    default: 0
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const Profile =
mongoose.model("Profile", profileSchema);