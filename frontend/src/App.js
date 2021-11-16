import { BrowserRouter as Router, Route } from 'react-router-dom'
import LoginScreen from './Screens/LoginScreen'
import HomeScreen from './Screens/HomeScreen'
import NotificationScreen from './Screens/NotificationScreen'
// import ChatScreen from './Screens/ChatScreen'

function App() {
	return (
		<Router>
			<Route path='/' exact component={HomeScreen} />
			<Route path='/login' component={LoginScreen} />
			{/* <Route path='/chat/:id' component={ChatScreen} /> */}
			<Route path='/notification' component={NotificationScreen} />
		</Router>
	)
}

export default App
