import express from "express";
import { likeUser ,getLikesYou} from "../controller/like.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:userId", auth, likeUser);
router.get("/", auth, getLikesYou);


export default router;