import { BrowserRouter as Router, Route } from 'react-router-dom'
import { SocketContext, socket } from './socket'
import LoginScreen from './Screens/LoginScreen'
import HomeScreen from './Screens/HomeScreen'

import NotificationScreen from './Screens/NotificationScreen'

function App() {
	return (
		<Router>
			<Route path='/' exact>
				<SocketContext.Provider value={socket}>
					<HomeScreen />
				</SocketContext.Provider>
			</Route>

			<Route path='/notification'>
				<SocketContext.Provider value={socket}>
					<NotificationScreen />
				</SocketContext.Provider>
			</Route>

			<Route path='/login' component={LoginScreen} />
			{/* <Route path='/chat' component={ChatScreen} /> */}
		</Router>
	)
}

export default App
