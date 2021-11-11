import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler(async (req, res, next) => {
	let tokken
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			tokken = req.headers.authorization.split(' ')[1]
			const decode = jwt.verify(tokken, process.env.JWT_SECRET)
			req.user = await User.findById(decode.id)
			next()
		} catch (error) {
			console.log(error)
			res.status(401)
			throw new Error('Not Authorized')
		}
	}
	if (!tokken) {
		res.status(401)
		throw new Error('Tokken Not Found')
	}
})

export { protect }
