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

    edited: {
    type: Boolean,
    default: false,
    },

   deletedForEveryone: {
    type: Boolean,
   default: false,
   },

   deletedFor: {
   type: [mongoose.Schema.Types.ObjectId],
   ref: "User",
   default: [],
   },

   pinnedBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "user",
   },

   pinExpiresAt: {
    type: Date,
   default: null,
   },
  
   replyTo: {
    messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
   },
    text: String,
    senderName: String,
   },

   reactions: [
   {
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "user",
   },
   emoji: String,
   }
   ],

   media: [
   {
    url: {
      type: String,
    },

    type: {
      type: String,
      enum: ["image", "video"],
    },
   },
   ],

   mediaType: {
   type: String,
   enum: ["image", "video", ""],
   default: "",
   },

  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);