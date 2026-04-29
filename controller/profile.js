import { Profile } from "../model/profile.js";
import cloudinary from "../config/cloudinary.js";



// ================= CREATE PROFILE =================
export const createProfile = async (req, res) => {
  const userId = req.user.id;
  const body = req.body || {};

  const {
    name,
    age,
    gender,
    phone,
    bio,
    prompt
  } = body;

  try {
    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    if (!name || !age || !gender) {
      return res.status(400).json({
        message: "Name, age and gender are required"
      });
    }

    // UPLOAD PHOTOS
    const uploadedPhotos = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`; 

        const result = await cloudinary.uploader.upload(base64, {
          folder: "avena_profiles"
        });

        uploadedPhotos.push(result.secure_url);
      }
    }

    // COMPLETION LOGIC
    let completedFields = 0;

    if (name) completedFields++;
    if (age) completedFields++;
    if (gender) completedFields++;
    if (bio) completedFields++;
    if (prompt) completedFields++;
    if (uploadedPhotos.length >= 2) completedFields++;

    const completionPercentage = Math.floor((completedFields / 6) * 100);

    const profile = await Profile.create({
      userId,
      name,
      age,
      gender,
      phone,
      bio,
      prompt,
      photos: uploadedPhotos,
      completionPercentage,
      isProfileComplete: completionPercentage >= 70
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ================= GET PROFILE =================
export const getMyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json(profile);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  const {
    name,
    age,
    gender,
    phone,
    bio,
    prompt,
    city,
    nationality,
    school,
    height,
    zodiac,
    socialType,
    musicTaste,
    movieTaste,
    favoriteFood,
    dreamCountry,
    firstHangout,
    greenFlag,
    redFlag
  } = req.body;

  
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    // BASIC
    if (name) profile.name = name;
    if (age) profile.age = age;
    if (gender) profile.gender = gender;
    if (phone) profile.phone = phone;
    if (bio) profile.bio = bio;
    if (prompt) profile.prompt = prompt;

    // DETAILS
    if (city) profile.city = city;
    if (nationality) profile.nationality = nationality;
    if (school) profile.school = school;
    if (height) profile.height = height;
    if (zodiac) profile.zodiac = zodiac;
    if (socialType) profile.socialType = socialType;

    // ARRAYS
    if (musicTaste) profile.musicTaste = musicTaste;
    if (musicTaste) {
  profile.musicTaste = Array.isArray(musicTaste)
    ? musicTaste
    : JSON.parse(musicTaste);
}

    if (movieTaste) {
  profile.movieTaste = Array.isArray(movieTaste)
    ? movieTaste
    : JSON.parse(movieTaste);
}
    // FUN
    if (favoriteFood) profile.favoriteFood = favoriteFood;
    if (dreamCountry) profile.dreamCountry = dreamCountry;
    if (firstHangout) profile.firstHangout = firstHangout;
    if (greenFlag) profile.greenFlag = greenFlag;
    if (redFlag) profile.redFlag = redFlag;

    // ================= PHOTO UPLOAD =================
    if (req.files && req.files.length > 0) {
      const uploadedPhotos = [];
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "avena_profiles"
        });

        uploadedPhotos.push(result.secure_url);
      }

      // append new photos
      profile.photos = [...profile.photos, ...uploadedPhotos];
    }

    // ================= COMPLETION =================
    let completedFields = 0;

    if (profile.name) completedFields++;
    if (profile.age) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.bio) completedFields++;
    if (profile.prompt) completedFields++;
    if (profile.photos.length >= 2) completedFields++;
    if (profile.city) completedFields++;
    if (profile.school) completedFields++;
    if (profile.zodiac) completedFields++;
    if (profile.musicTaste.length > 0) completedFields++;
    if (profile.movieTaste.length > 0) completedFields++;
    if (profile.greenFlag) completedFields++;

    profile.completionPercentage = Math.floor((completedFields / 12) * 100);
    profile.isProfileComplete = profile.completionPercentage >= 75;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};