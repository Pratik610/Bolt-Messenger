import express, { json } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import connectDB from './utils/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()
connectDB()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'https://bolt-messenger.herokuapp.com',
	},
	methods: ['GET', 'POST'],
	secure: true,
})

app.use(json())
app.use(cors())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

let users = []

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId })
}

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
	return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
	// when connect
	console.log('Connected')

	// take userid and socketid from user
	socket.on('addUser', (userId) => {
		addUser(userId, socket.id)
		io.emit('getUsers', users)
	})

	// send and get msg
	socket.on('sendMessage', ({ sender, reciver, message, convoId }) => {
		const user = getUser(reciver)
		if (user) {
			io.to(user.socketId).emit('getMessage', { sender, message, convoId })
		}
	})

	//  call User request
	socket.on('callUser', ({ reciver, user, caller }) => {
		const userToCall = getUser(reciver)

		if (userToCall) {
			io.to(userToCall.socketId).emit('callUser', { caller, user })
		}
	})

	// answer call
	socket.on('answerCall', ({ reciver, user, caller }) => {
		const userTo = getUser(reciver)
		if (userTo) {
			io.to(userTo.socketId).emit('callAccepted', { caller, user })
		}
	})

	// reject call
	socket.on('rejectCall', ({ reciver }) => {
		const userTo = getUser(reciver)
		if (userTo) {
			io.to(userTo.socketId).emit('callRejected')
		}
	})

	socket.on('cancelCall', ({ reciver }) => {
		const userTo = getUser(reciver)
		if (userTo) {
			io.to(userTo.socketId).emit('callCanceled')
		}
	})

	// ongoing call
	socket.on('onGoingCall', ({ to, signal }) => {
		const userTo = getUser(to)
		if (userTo) {
			io.to(userTo.socketId).emit('onGoingCall', { signal })
		}
	})

	// call End
	socket.on('endCall', ({ reciver }) => {
		console.log(reciver)
		const userTo = getUser(reciver)
		if (userTo) {
			io.to(userTo.socketId).emit('endCall')
		}
	})

	// when disconect
	socket.on('disconnect', () => {
		console.log('user Disconnected')
		removeUser(socket.id)
		io.emit('getUsers', users)
	})
})

if (process.env.ENVIRONMENT === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')))

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	)
}

app.use(notFound)
app.use(errorHandler)

server.listen(
	process.env.PORT || 5000,
	console.log(`Server Running on PORT ${process.env.PORT}`)
)
