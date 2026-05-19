import { Message } from "../model/message.js";

export const sendMessage = async (req, res) => {

  try {

    const sender = req.user.id;

    const receiver = req.params.id;

    const { text } = req.body;

    const newMessage = await Message.create({
      sender,
      receiver,
      text,
    });

    res.status(201).json(newMessage);

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
        $nin: [userId]
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
      !message.deletedFor.includes(userId)
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