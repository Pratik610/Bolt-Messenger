import express from 'express'
import {
	getClientID,
	loginUser,
	getLoginUserInfo,
	searchUser,
	requestConnection,
	cancelRequestConnection,
	getPendingRequests,
	addToFriends,
} from '../controllers/userControlers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/client').get(getClientID)
router.route('/login').post(loginUser)
router.route('/search/user').post(protect, searchUser)
router.route('/').get(protect, getLoginUserInfo)
router.route('/request').post(protect, requestConnection)
router.route('/cancel').post(protect, cancelRequestConnection)
router.route('/pending').get(protect, getPendingRequests)
router.route('/accept').post(protect, addToFriends)

export default router
