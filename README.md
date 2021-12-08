# Bolt-Messenger ( Realtime Messaging & Video Calling )

##### This is a WebApp made with MERN Stack (MongoDB ,Exress.js , React.js , Node.js )

### Env Variables

```
ENVIORNMENT = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
CLIENT_ID = your google client id
CLIENT_SECRET = your google client secret
```

### Note

change the the domain origin in backend > server.js & frontend > src > socket.js for socket.io

```
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
	methods: ['GET', 'POST'],
	secure: true,
})

```

```
export const socket = io('ws://localhost:5000', {
	transports: ['websocket', 'polling'],
})

```

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```
