import express from "express";

import {
  sendMessage,
  getMessages,
} from "../controller/message.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", auth, sendMessage);

router.get("/:id", auth, getMessages);

export default router;