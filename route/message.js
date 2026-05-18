import express from "express";

import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} from "../controller/message.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", auth, sendMessage);

router.get("/:id", auth, getMessages);
router.delete("/:id", auth, deleteMessage);
router.put("/:id", auth, editMessage);



export default router;