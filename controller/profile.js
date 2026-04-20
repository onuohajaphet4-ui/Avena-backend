import { Profile } from "../model/profile.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROFILE
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

  // console.log(req.body);
  // console.log(req.files);

  try {
    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    // required fields
    if (!name || !age || !gender) {
      return res.status(400).json({
        message: "Name, age and gender are required"
      });
    }

    const uploadedPhotos = [];

    // multer files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "avena_profiles"
        });

        uploadedPhotos.push(result.secure_url);
      }
    }

    let completedFields = 0;

    if (name) completedFields++;
    if (age) completedFields++;
    if (gender) completedFields++;
    if (phone) completedFields++;
    if (bio) completedFields++;
    if (prompt) completedFields++;
    if (uploadedPhotos.length >= 2) completedFields++;

    const completionPercentage =
      Math.floor((completedFields / 7) * 100);

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
      isProfileComplete: completionPercentage >= 80
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// GET MY PROFILE
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
    res.status(500).json({
      message: "Server Error"
    });
  }
};




// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  const {
    name,
    age,
    gender,
    phone,
    bio,
    prompt,
    photos
  } = req.body;

  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    if (name) profile.name = name;
    if (age) profile.age = age;
    if (gender) profile.gender = gender;
    if (phone) profile.phone = phone;
    if (bio) profile.bio = bio;
    if (prompt) profile.prompt =prompt;
    if (photos) profile.photos = photos;

    let completedFields = 0;

    if (profile.name) completedFields++;
    if (profile.age) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.bio) completedFields++;
    if (profile.prompt) completedFields++;
    if (profile.photos.length > 0) completedFields++;

    profile.completionPercentage =
      Math.floor((completedFields / 7) * 100);

    profile.isProfileComplete =
      profile.completionPercentage >= 70;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};





