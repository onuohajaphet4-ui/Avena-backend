import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);