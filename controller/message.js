import { Message } from "../model/message.js";
import streamifier from 'streamifier'
import cloudinary from "../config/cloudinary.js";
export const sendMessage = async (req, res) => {
  try {

    const sender = req.user.id;
    const receiver = req.params.id;

    const { text, replyTo } = req.body;

    let media = [];

    // UPLOAD MULTIPLE FILES
    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const streamUpload = () => {
          return new Promise((resolve, reject) => {

            const stream =
              cloudinary.uploader.upload_stream(
                {
                  resource_type: "auto",
                },
                (error, result) => {

                  if (result) {
                    resolve(result);
                  } else {
                    reject(error);
                  }

                }
              );

            streamifier
              .createReadStream(file.buffer)
              .pipe(stream);

          });
        };

        const result = await streamUpload();

        media.push({
          url: result.secure_url,
          type: file.mimetype.startsWith("image")
            ? "image"
            : "video",
        });

      }

    }

    const newMessage = await Message.create({
      sender,
      receiver,
      text,
      media,
      replyTo: replyTo
        ? JSON.parse(replyTo)
        : null,
    });

    const populatedMessage =
      await Message.findById(newMessage._id);

    res.status(201).json(populatedMessage);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }
};

export const getMessages = async (req, res) => {

  try {

    const currentUser = req.user.id;

    const otherUser = req.params.id;

    const messages = await Message.find({

      $or: [

        {
          sender: currentUser,
          receiver: otherUser,
        },

        {
          sender: otherUser,
          receiver: currentUser,
        },

      ],

      deletedFor: {
        $nin: [currentUser]
      },

    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};

export const deleteMessage = async (
  req,
  res
) => {

  try {

    const { id } = req.params;
    const userId = req.user.id;


    const message =
      await Message.findById(id);

    if (!message) {

      return res.status(404).json({
        message: "Message not found",
      });

    }

    // ONLY SENDER CAN DELETE
    if (
      message.sender.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    message.text = "This message was deleted";
    message.deletedForEveryone = true;
    await message.save();

    res.status(200).json({
      message: "Message deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const deleteForMe = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const userId = req.user.id;

    const message = await Message.findById(id);

    if (!message) {

      return res.status(404).json({
        message: "Message not found",
      });

    }

    // ADD USER TO deletedFor ARRAY
    if (
      !(message.deletedFor || []).includes(userId)
    ) {

      message.deletedFor.push(userId);

    }

    await message.save();

    res.status(200).json({
      message: "Deleted for you",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};

export const editMessage = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { text } = req.body;

    const message =
      await Message.findById(id);

    if (!message) {

      return res.status(404).json({
        message: "Message not found",
      });

    }

    // ONLY SENDER CAN EDIT
    if (
      message.sender.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    message.text = text;

    // OPTIONAL EDIT FLAG
    message.edited = true;

    await message.save();

    res.status(200).json(message);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const pinMessage = async (req, res) => {

  try {

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    // UNPIN
    if (message.pinnedBy) {

      message.pinnedBy = null;
      message.pinExpiresAt = null;

    } else {

      // PIN
      const duration = req.body.duration;

      let expireDate = new Date();

      if (duration === "24h") {
        expireDate.setHours(expireDate.getHours() + 24);
      }

      if (duration === "7d") {
        expireDate.setDate(expireDate.getDate() + 7);
      }

      if (duration === "30d") {
        expireDate.setDate(expireDate.getDate() + 30);
      }

      message.pinnedBy = req.user.id;
      message.pinExpiresAt = expireDate;
    }

    await message.save();

    res.status(200).json({
      message: "Message updated",
      data: message,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const markMessageAsRead = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {

      return res.status(404).json({
        message: "Message not found",
      });

    }

    message.read = true;

    message.readAt = new Date();

    await message.save();

    res.status(200).json({
      message: "Message marked as read",
      data: message,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};

export const reactToMessage = async (req, res) => {

  try {

    const { emoji } = req.body;
    const message = await Message.findById(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json(
        "Message not found"
      );
    }
    const existingReaction =
      message.reactions.find(
        (r) =>
          r.user.toString() === req.user.id
      );
    // USER ALREADY HAS REACTION
    if (existingReaction) {
      // SAME EMOJI = REMOVE REACTION
      if (existingReaction.emoji === emoji) {

        message.reactions =
          message.reactions.filter(
            (r) =>
              r.user.toString() !== req.user.id
          );

      }

      // DIFFERENT EMOJI = REPLACE
      else {
        existingReaction.emoji = emoji;
      }
    }
    // NO REACTION YET
    else {

      message.reactions.push({
        user: req.user.id,
        emoji,
      });

    }
    await message.save();
    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json(
      "Server Error"
    );

  }

};