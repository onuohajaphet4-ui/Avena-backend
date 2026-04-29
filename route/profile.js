import express from 'express'
import auth from '../middleware/auth.js'
import { createProfile, getMyProfile, updateProfile } from '../controller/profile.js'
import upload from "../middleware/upload.js";

const router = express.Router ()

router.post ("/",auth,upload.array("photos", 6),createProfile )
router.get ('/',auth,getMyProfile )
router.put ('/',auth,upload.array("photos", 6), updateProfile)

export default router
