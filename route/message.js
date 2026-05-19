import express from "express";

import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  deleteForMe,
} from "../controller/message.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", auth, sendMessage);
router.get("/:id", auth, getMessages);
router.delete("/:id", auth, deleteMessage);
router.delete("/delete-for-me/:id", auth, deleteForMe);
router.put("/:id", auth, editMessage);



export default router;