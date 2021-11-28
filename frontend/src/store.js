import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
	userLoginReducer,
	userInfoReducer,
	searchUserReducer,
	requestConnectionReducer,
	cancelConnectionReducer,
	pendingRequestReducer,
	acceptRequestReducer,
} from './Reducers/userReducers.js'

import {
	getChatReducer,
	sendMessageReducer,
	getStackReducer,
	callUserReducer,
} from './Reducers/chatReducers.js'

const reducer = combineReducers({
	userLogin: userLoginReducer,
	userInfo: userInfoReducer,
	searchUser: searchUserReducer,
	requestConnection: requestConnectionReducer,
	cancelConnection: cancelConnectionReducer,
	pendingRequest: pendingRequestReducer,
	acceptRequest: acceptRequestReducer,
	getChat: getChatReducer,
	sendMessage: sendMessageReducer,
	getStack: getStackReducer,
	callUser: callUserReducer,
})

const userId = localStorage.getItem('userId')
	? JSON.parse(localStorage.getItem('userId'))
	: null

const initialState = {
	userLogin: { userId },
}

const middleware = [thunk]

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
)

export default store
