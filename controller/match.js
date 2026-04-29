import { Match } from "../model/match.js";
import { Profile } from "../model/profile.js";

export const getMatches = async (req, res) => {

  try {

    const userId = req.user.id;

    const matches = await Match.find({
      users: userId,
    }).populate("users");

    const updatedMatches = await Promise.all(

      matches.map(async (match) => {

        const usersWithProfiles = await Promise.all(

          match.users.map(async (u) => {

            const profile = await Profile.findOne({
              userId: u._id,
            });

            return {
              ...u._doc,
              profile,
            };

          })

        );

        return {
          ...match._doc,
          users: usersWithProfiles,
        };

      })

    );

    res.status(200).json(updatedMatches);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};