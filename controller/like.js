import { Like } from "../model/like.js";
import { Match } from "../model/match.js";
import { Profile } from "../model/profile.js";
import { Preference } from "../model/preference.js";

export const likeUser = async (req, res) => {
  try {

    const sender = req.user.id;
    const receiver = req.params.userId;

    // prevent liking yourself
    if (sender === receiver) {
      return res.status(400).json({
        message: "You cannot like yourself",
      });
    }

    // check if already liked
    const existingLike = await Like.findOne({
      sender,
      receiver,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    

    // check reverse like FIRST
const reverseLike = await Like.findOne({
   sender: receiver,
   receiver: sender,
});

// create like
await Like.create({
   sender,
   receiver,
});

if (reverseLike) {

   await Match.create({
      users: [sender, receiver],
   });

   return res.status(200).json({
      matched: true,
      message: "Matched ❤️",
   });
  }

return res.status(200).json({
   matched: false,
   message: "User liked",
});

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getAge = (dob) => {

  if (!dob) return 0;

  const birthDate = new Date(dob);

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {

    age--;

  }

  return age;

};

export const getLikesYou = async (req, res) => {

  try {

    const userId = req.user.id;

    
    const matches = await Match.find({
      users: userId,
    });

    // GET MATCHED USER IDS
    const matchedUserIds = matches.flatMap((match) =>

      match.users.filter(
        (id) => id.toString() !== userId
      )

    );

    // GET LIKES EXCLUDING MATCHED USERS
    const likes = await Like.find({
      receiver: userId,

      sender: {
        $nin: matchedUserIds,
      },

    }).populate("sender");

    const currentProfile = await Profile.findOne({
  userId,
});

const currentPreference = await Preference.findOne({
  userId,
});

const formattedLikes = await Promise.all(

  likes.map(async (like) => {

    const profile = await Profile.findOne({
      userId: like.sender._id,
    });

    // if(!profile) return null

    const preference = await Preference.findOne({
      userId: like.sender._id,
    });

    

    let score = 0;

// GENDER
if (
  currentPreference?.lookingFor === "Everyone" ||
  currentPreference?.lookingFor === profile?.gender
) {

  score += 20;

} else {

  score -= 10;

}

// AGE
const age = getAge(profile?.age);

if (
  age >= currentPreference?.ageRangeMin &&
  age <= currentPreference?.ageRangeMax
) {

  score += 15;

} else {

  score -= 5;

}

// RELATIONSHIP TYPE
if (
  preference?.relationshipType ===
  currentPreference?.relationshipType
) {

  score += 15;

}

// INTERESTS
const myInterests =
  currentPreference?.interests || [];

const theirInterests =
  preference?.interests || [];

const sharedInterests =
  myInterests.filter((i) =>
    theirInterests.includes(i)
  );

if (sharedInterests.length >= 3) {

  score += 25;

}

// SAME CITY
if (
  profile?.city &&
  profile?.city === currentProfile?.city
) {

  score += 10;

}

// SAME SCHOOL
if (
  profile?.school &&
  profile?.school === currentProfile?.school
) {

  score += 10;

}

// ZODIAC
if (
  profile?.zodiac === currentProfile?.zodiac
) {

  score += 5;

}

// PROFILE QUALITY
if (
  profile?.completionPercentage < 50
) {

  score -= 20;

}
    

    return {

      ...like.toObject(),

      profile,

      preference,

      sharedInterests,

      score,

    };

  })

);


  console.log("H:", formattedLikes)
  console.log("HIM:", likes)

    res.status(200).json(formattedLikes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};