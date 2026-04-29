import express from "express";
import { getDiscoverById, getDiscoverUsers } from "../controller/discover.js";
import auth from '../middleware/auth.js'

const router = express.Router();

router.get("/", auth, getDiscoverUsers);
router.get("/:id", auth, getDiscoverById);

export default router;