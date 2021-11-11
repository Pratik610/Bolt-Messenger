import { Server } from 'socket.io'

const io = new Server({
	cors: {
		origin: 'http://localhost:3000',
	},
})

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
	socket.on('sendMessage', ({ senderId, reciverId, message }) => {
		const user = getUser(reciverId)
		io.to(user.socketId).emit('getMessage', { senderId, message })
	})

	// when disconect
	socket.on('disconnect', () => {
		removeUser(socket.id)
		io.emit('getUsers', users)
	})
})

io.listen(4000)
