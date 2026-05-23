import express from "express";
import upload from "../middleware/upload.js";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  deleteForMe,
  pinMessage,
  markMessageAsRead,
  reactToMessage,
} from "../controller/message.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", auth,upload.single("media"), sendMessage);
router.get("/:id", auth, getMessages);
router.delete("/:id", auth, deleteMessage);
router.delete("/delete-for-me/:id", auth, deleteForMe);
router.put("/:id", auth, editMessage);
router.put("/pin/:id", auth, pinMessage);
router.put("/read/:id", auth, markMessageAsRead);
router.put("/react/:messageId", auth, reactToMessage);



export default router;