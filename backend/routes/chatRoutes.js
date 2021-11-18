import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
	getChats,
	sendMessage,
	getUserStackMessage,
} from '../controllers/chatControlers.js'
const router = express.Router()

router.route('/getchat').post(protect, getChats)
router.route('/sendmsg').post(protect, sendMessage)
router.route('/getstack').get(protect, getUserStackMessage)

export default router
