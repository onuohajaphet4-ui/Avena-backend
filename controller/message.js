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

    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

};