import express from 'express'

import auth from '../middleware/auth.js'
import { createPreference, getMyPreference, updatePreference } from '../controller/preference.js'

const router = express.Router ()
 
router.post ('/', auth,  createPreference)
router.get ('/', auth,  getMyPreference)
router.put ('/', auth,  updatePreference)

export default router
