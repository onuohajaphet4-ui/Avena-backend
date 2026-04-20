import { Preference } from "../model/preference.js";


// CREATE PREFERENCES
export const createPreference = async (req, res) => {
  const userId = req.user.id;

  const {
    lookingFor,
    relationshipType,
    interests,
    personalityAnswers,
    personalityType,
    ageRangeMin,
    ageRangeMax
    
  } = req.body;

  try {
    const existingPreference = await Preference.findOne({ userId });

    if (existingPreference) {
      return res.status(400).json({
        message: "Preferences already exist"
      });
    }

    const preference = await Preference.create({
      userId,
      lookingFor,
      relationshipType,
      interests,
      personalityAnswers,
      personalityType,
      ageRangeMin,
      ageRangeMax
    });

    res.status(201).json({
      message: "Preferences created successfully",
      preference
    });
    } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};




// GET MY PREFERENCES
export const getMyPreference = async (req, res) => {
  const userId = req.user.id;

  try {
    const preference = await Preference.findOne({ userId });

    if (!preference) {
      return res.status(404).json({
        message: "Preferences not found"
      });
    }

    res.status(200).json(preference);

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};




// UPDATE PREFERENCES
export const updatePreference = async (req, res) => {
  const userId = req.user.id;

  const {
     lookingFor,
    relationshipType,
    interests,
    personalityAnswers,
    personalityType,
    ageRangeMin,
    ageRangeMax
  } = req.body;

  try {
    const preference = await Preference.findOne({ userId });

    if (!preference) {
      return res.status(404).json({
        message: "Preferences not found"
      });
    }

    if (lookingFor) preference.lookingFor = lookingFor;
    if (relationshipType) preference.relationshipType = relationshipType;
    if (interests) preference.interests = interests;
    if (personalityAnswers) preference.personalityAnswers = personalityAnswers;
    if (personalityType) preference.personalityType = personalityType;
    if (ageRangeMin) preference.ageRangeMin = ageRangeMin;
    if (ageRangeMax) preference.ageRangeMax = ageRangeMax;

    await preference.save();

    res.status(200).json({
      message: "Preferences updated successfully",
      preference
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};