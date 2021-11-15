import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import Members from '../models/MemberModel.js'
import { createTokken } from '../utils/tokken.js'

// send google client to frontend
export const getClientID = asyncHandler(async (req, res) => {
	res.status(200).json(process.env.CLIENT_ID)
})

//  login with google (manageing the response)
export const loginUser = asyncHandler(async (req, res) => {
	const googleId = req.body.info.googleId
	const profilePhoto = req.body.info.imageUrl
	const name = req.body.info.name
	const email = req.body.info.email

	const userExists = await User.findOne({ googleId })

	if (userExists) {
		userExists.name = name || userExists.name
		userExists.profilePhoto = profilePhoto || userExists.profilePhoto
		userExists.email = email || userExists.email

		const updateUser = await userExists.save()
		if (updateUser) {
			res.status(201).json({
				_id: updateUser._id,
				tokken: createTokken(updateUser._id),
			})
		}
	} else {
		const createUser = await User.create({
			name,
			email,
			profilePhoto,
			googleId,
		})

		if (createUser) {
			res
				.status(201)
				.json({ _id: createUser._id, tokken: createTokken(createUser._id) })
		}
	}
})

// get login user info
export const getLoginUserInfo = asyncHandler(async (req, res) => {
	const id = req.user._id

	const user = await User.findById(id)
	if (user) {
		res.status(201).json(user)
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})

// search user
export const searchUser = asyncHandler(async (req, res) => {
	const search = req.body.search
	const id = req.user._id
	if (search != '') {
		let user = await User.find({
			name: { $regex: `^${search}`, $options: 'i' },
		}).limit(5)

		if (user) {
			res.status(201).json(user)
		} else {
			res.status(404)
			throw new Error('User Not Found')
		}
	}
})

// send friend request
export const requestConnection = asyncHandler(async (req, res) => {
	const id = req.body.id
	const requestedUser = await User.findById(id)
	if (requestedUser) {
		requestedUser.pendingRequest.push(req.user._id)
		await requestedUser.save()
		res.status(201).json({ message: 'Connection Request Send' })
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// cancel friend request
export const cancelRequestConnection = asyncHandler(async (req, res) => {
	const id = req.body.id
	const requestedUser = await User.findById(id)
	if (requestedUser) {
		requestedUser.pendingRequest.splice(
			requestedUser.pendingRequest.indexOf(req.user._id),
			1
		)
		await requestedUser.save()

		res.status(201).json({ message: 'Connection Request Cancel' })
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// get pending friend requests
export const getPendingRequests = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (user) {
		const pendingUsers = await User.find({ _id: user.pendingRequest })
		if (pendingUsers) {
			res.status(201).json(pendingUsers)
		}
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// add friend
export const addToFriends = asyncHandler(async (req, res) => {
	const id = req.body.id
	const requestedUser = await User.findById(id)
	const user = await User.findById(req.user._id)
	if (requestedUser && user) {
		user.friends.push(requestedUser._id)
		requestedUser.friends.push(user._id)
		user.pendingRequest.splice(
			user.pendingRequest.indexOf(requestedUser._id),
			1
		)
		const ru = await requestedUser.save()
		const u = await user.save()
		const conv = await Members.create({ users: [user._id, requestedUser._id] })
		if (ru && u && conv) {
			res.status(201).json({ message: 'Friend Request Accepted' })
		}
	} else {
		res.status(404)
		throw new Error('User not Found')
	}
})

// export const getUserInfoById = asyncHandler(async (req, res) => {
// 	const id = req.body.id

// 	const user = await User.findById(id)
// 	if (user) {
// 		res.status(201).json(user)
// 	} else {
// 		res.status(404)
// 		throw new Error('User Not Found')
// 	}
// })
