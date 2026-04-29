import express from 'express'
import { creatUser, loginUsers, getAllUser , forgotPassword,resetPassword, deleteUser, userExist, updateUser, getUserById} from '../controller/user.js'
import auth from '../middleware/auth.js'

const router = express.Router ()

router.post ('/', creatUser)
router.post ('/check-email', userExist)
router.post ('/reset-password', forgotPassword)
router.post ('/reset-password/:token', resetPassword)
router.get ('/', getAllUser)
router.get ('/:id', auth, getUserById)
router.post ('/login', loginUsers)
router.delete ('/delete/:id',  auth, deleteUser)
router.put ('/update/:id',  auth, updateUser)

export default router 