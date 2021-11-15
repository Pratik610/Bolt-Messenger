import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import Members from '../models/MemberModel.js'
import Chat from '../models/ChatModel.js'

// get chats with user
export const getChats = asyncHandler(async (req, res) => {
	const user1 = req.body.users[0]
	const user2 = req.body.users[1]
	const convo = await Members.findOne({
		$or: [{ users: [user1, user2] }, { users: [user2, user1] }],
	})
	if (convo) {
		const chats = await Chat.find({ convoId: convo._id })
		const users = await User.find({ _id: convo.users })
		res.status(201).json({ chats, users, convoId: convo._id })
	} else {
		res.status(404)
		throw new Error('Not Found')
	}
})

// send message to user
export const sendMessage = asyncHandler(async (req, res) => {
	const chat = Chat.create({
		convoId: req.body.convoId,
		message: req.body.msg,
		sender: req.user._id,
	})

	if (chat) {
		res.status(201).json({ msg: 'Send Success !' })
	}
})

// export const getUserStackMessage = asyncHandler(async (req, res) => {
// 	const stack = Members.find({ users: req.user._id }).sort({ createdAt: -1 })
// })
