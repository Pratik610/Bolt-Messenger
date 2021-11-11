import mongoose from 'mongoose'

const membersSchema = new mongoose.Schema(
	{
		users: [
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

const Members = mongoose.model('Members', membersSchema)

export default Members
