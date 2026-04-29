import { Profile } from "../model/profile.js";
import { Preference } from "../model/preference.js";
import { Match } from "../model/match.js";

export const getDiscoverUsers = async (req, res) => {

  try {

    const userId = req.user.id;

    const myProfile = await Profile.findOne({
      userId,
    });

    const myPref = await Preference.findOne({
      userId,
    });

    // COMPLETE PROFILE CHECK
    if (!myProfile || !myPref) {

      return res.status(400).json({
        message: "Complete profile first",
      });

    }






    // GET MATCHES
    const matches = await Match.find({
      users: userId,
    });




    // GET MATCHED USER IDS
    const matchedUserIds = matches.flatMap((match) =>

      match.users.filter(
        (id) => id.toString() !== userId
      )

    );







    // GET OTHER USERS EXCLUDING MATCHED USERS
    const users = await Profile.find({

      userId: {
        $ne: userId,
        $nin: matchedUserIds,
      },

    });

    let scoredUsers = [];

    // AGE HELPER
    const getAge = (dob) => {

      const diff =
        Date.now() - new Date(dob).getTime();

      return (
        new Date(diff).getUTCFullYear() - 1970
      );

    };








    for (let user of users) {

      const pref = await Preference.findOne({
        userId: user.userId,
      });

      if (!pref) continue;

      let score = 0;





      // GENDER
      if (

        myPref.lookingFor === "Everyone" ||

        myPref.lookingFor === user.gender

      ) {

        score += 20;

      } else {

        score -= 10;

      }







      // AGE
      const age = getAge(user.age);

      if (

        age >= myPref.ageRangeMin &&

        age <= myPref.ageRangeMax

      ) {

        score += 15;

      } else {

        score -= 5;

      }







      // RELATIONSHIP TYPE
      if (
        pref.relationshipType ===
        myPref.relationshipType
      ) {

        score += 15;

      }







      // INTERESTS
      const myInterests =
        myPref.interests || [];

      const theirInterests =
        pref.interests || [];

      const sharedInterests =
        myInterests.filter((i) =>
          theirInterests.includes(i)
        );

      if (sharedInterests.length >= 3) {

        score += 25;

      }







      // SAME CITY
      if (
        user.city &&
        user.city === myProfile.city
      ) {

        score += 10;

      }







      // SAME SCHOOL
      if (
        user.school &&
        user.school === myProfile.school
      ) {

        score += 10;

      }







      // ZODIAC
      if (
        user.zodiac === myProfile.zodiac
      ) {

        score += 5;

      }







      // PROFILE QUALITY
      if (
        user.completionPercentage < 50
      ) {

        score -= 20;

      }







      // FINAL PUSH
      scoredUsers.push({

        ...user.toObject(),

        preference: pref,

        sharedInterests,

        score,

      });

    }







    // SORT BEST → WORST
    scoredUsers.sort(
      (a, b) => b.score - a.score
    );







    // LIMIT TO 20
    const result =
      scoredUsers.slice(0, 20);







    res.status(200).json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};

export const getDiscoverById = async (req, res) => {

  try {

    const profile = await Profile.findOne({
      userId: req.params.id,
    });

    if (!profile) {

      return res.status(404).json({
        message: "Profile not found",
      });

    }

    const preference = await Preference.findOne({
      userId: req.params.id,
    });

    res.json({
      profile,
      preference,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};