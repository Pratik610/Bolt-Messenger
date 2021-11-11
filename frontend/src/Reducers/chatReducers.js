import {
	GET_CHAT_FAIL,
	GET_CHAT_REQUEST,
	GET_CHAT_SUCCESS,
	SEND_MSG_FAIL,
	SEND_MSG_REQUEST,
	SEND_MSG_SUCCESS,
} from '../Constants/chatConstants.js'

export const getChatReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_CHAT_REQUEST:
			return { loading: true }
		case GET_CHAT_SUCCESS:
			return { loading: false, chats: action.payload }
		case GET_CHAT_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const sendMessageReducer = (state = {}, action) => {
	switch (action.type) {
		case SEND_MSG_REQUEST:
			return { loading: true }
		case SEND_MSG_SUCCESS:
			return { loading: false, success: true }
		case SEND_MSG_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}
