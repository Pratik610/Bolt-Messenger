import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	GET_LOGIN_USER_REQUEST,
	GET_LOGIN_USER_SUCCESS,
	GET_LOGIN_USER_FAIL,
	SEARCH_USER_REQUEST,
	SEARCH_USER_SUCCESS,
	SEARCH_USER_FAIL,
	SEARCH_USER_RESET,
	CONNECTION_USER_FAIL,
	CONNECTION_USER_REQUEST,
	CONNECTION_USER_SUCCESS,
	CANCEL_CONNECTION_USER_REQUEST,
	CANCEL_CONNECTION_USER_FAIL,
	CANCEL_CONNECTION_USER_SUCCESS,
	GET_PENDING_REQUEST,
	GET_PENDING_SUCCESS,
	GET_PENDING_FAIL,
	ACCEPT_FRIEND_REQUEST,
	ACCEPT_FRIEND_SUCCESS,
	ACCEPT_FRIEND_FAIL,
	USER_LOGOUT,
} from '../Constants/userConstants.js'

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return { loading: true }
		case USER_LOGIN_SUCCESS:
			return { loading: false, userId: action.payload }
		case USER_LOGIN_FAIL:
			return { loading: false, error: action.payload }
		case USER_LOGOUT:
			return {}
		default:
			return state
	}
}

export const userInfoReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_LOGIN_USER_REQUEST:
			return { loading: true }
		case GET_LOGIN_USER_SUCCESS:
			return { loading: false, user: action.payload }
		case GET_LOGIN_USER_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const searchUserReducer = (state = {}, action) => {
	switch (action.type) {
		case SEARCH_USER_REQUEST:
			return { loading: true }
		case SEARCH_USER_SUCCESS:
			return { loading: false, searched: action.payload }
		case SEARCH_USER_FAIL:
			return { loading: false, error: action.payload }
		case SEARCH_USER_RESET:
			return {}
		default:
			return state
	}
}

export const requestConnectionReducer = (state = {}, action) => {
	switch (action.type) {
		case CONNECTION_USER_REQUEST:
			return { loading: true }
		case CONNECTION_USER_SUCCESS:
			return { loading: false, request: true }
		case CONNECTION_USER_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const cancelConnectionReducer = (state = {}, action) => {
	switch (action.type) {
		case CANCEL_CONNECTION_USER_REQUEST:
			return { loading: true }
		case CANCEL_CONNECTION_USER_SUCCESS:
			return { loading: false, cancel: true }
		case CANCEL_CONNECTION_USER_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const pendingRequestReducer = (state = {}, action) => {
	switch (action.type) {
		case GET_PENDING_REQUEST:
			return { loading: true }
		case GET_PENDING_SUCCESS:
			return { loading: false, pending: action.payload }
		case GET_PENDING_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const acceptRequestReducer = (state = {}, action) => {
	switch (action.type) {
		case ACCEPT_FRIEND_REQUEST:
			return { loading: true }
		case ACCEPT_FRIEND_SUCCESS:
			return { loading: false, accept: true }
		case ACCEPT_FRIEND_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}
