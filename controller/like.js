import { Like } from "../model/Like.js";
import { Match } from "../model/Match.js";
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



    const formattedLikes = await Promise.all(

      likes.map(async (like) => {

        const profile = await Profile.findOne({
          userId: like.sender._id,
        });

        const preference = await Preference.findOne({
          userId: like.sender._id,
        });

        return {

          ...like.toObject(),

          profile,

          preference,

        };

      })

    );

    res.status(200).json(formattedLikes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};