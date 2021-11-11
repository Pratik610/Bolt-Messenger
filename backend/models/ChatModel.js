import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
	{
		convoId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Members',
		},
		message: {
			type: String,
		},
		type: {
			type: String,
			default: 'text',
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
