import express, { json } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import path from 'path'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import connectDB from './utils/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

dotenv.config()
connectDB()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(json())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

const __dirname = path.resolve()
app.use('/images', express.static(path.join(__dirname, '/images')))

if (process.env.ENVIRONMENT === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')))

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	)
}

let users = []

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId })
}

const removeUser = (socketId) => {
	users = users.find((user) => user.socketId !== socketId)
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
	socket.on('sendMessage', ({ sender, reciver, message }) => {
		const user = getUser(reciver)
		if (user) {
			io.to(user.socketId).emit('getMessage', { senderId, message })
		}
	})

	// when disconect
	socket.on('disconnect', () => {
		console.log('user Disconnected')
		removeUser(socket.id)
		io.emit('getUsers', users)
	})
})

app.use(notFound)
app.use(errorHandler)

server.listen(
	process.env.PORT,
	console.log(`Server Running on PORT ${process.env.PORT}`)
)
