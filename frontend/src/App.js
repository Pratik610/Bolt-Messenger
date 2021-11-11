import { BrowserRouter as Router, Route } from 'react-router-dom'
import LoginScreen from './Screens/LoginScreen'
import HomeScreen from './Screens/HomeScreen'
import NotificationScreen from './Screens/NotificationScreen'

function App() {
	return (
		<Router>
			<Route path='/' exact component={HomeScreen} />
			<Route path='/login' component={LoginScreen} />
			<Route path='/notification' component={NotificationScreen} />
		</Router>
	)
}

export default App
