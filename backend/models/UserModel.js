import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		googleId: {
			type: String,
			required: true,
		},
		profilePhoto: {
			type: String,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],

		pendingRequest: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
)

const User = mongoose.model('User', userSchema)

export default User
