import React from 'react'
import { io } from 'socket.io-client'

export const socket = io('https://bolt-messenger.herokuapp.com', {
	transports: ['websocket', 'polling'],
})
export const SocketContext = React.createContext()
