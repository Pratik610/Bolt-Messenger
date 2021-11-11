import axios from 'axios'
import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	GET_LOGIN_USER_REQUEST,
	GET_LOGIN_USER_SUCCESS,
	GET_LOGIN_USER_FAIL,
	SEARCH_USER_FAIL,
	SEARCH_USER_REQUEST,
	SEARCH_USER_SUCCESS,
	CONNECTION_USER_REQUEST,
	CONNECTION_USER_SUCCESS,
	CONNECTION_USER_FAIL,
	CANCEL_CONNECTION_USER_SUCCESS,
	CANCEL_CONNECTION_USER_FAIL,
	CANCEL_CONNECTION_USER_REQUEST,
	GET_PENDING_REQUEST,
	GET_PENDING_SUCCESS,
	GET_PENDING_FAIL,
	ACCEPT_FRIEND_REQUEST,
	ACCEPT_FRIEND_SUCCESS,
	ACCEPT_FRIEND_FAIL,
} from '../Constants/userConstants'

export const userLoginAction = (info) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		})
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}
		const { data } = await axios.post('/api/user/login', { info }, config)

		data &&
			dispatch({
				type: USER_LOGIN_SUCCESS,
				payload: data,
			})
		localStorage.setItem('userId', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getUserLoginInfo = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: GET_LOGIN_USER_REQUEST,
		})
		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.get('/api/user/', config)

		data &&
			dispatch({
				type: GET_LOGIN_USER_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: GET_LOGIN_USER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const searchUsersAction = (search) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SEARCH_USER_REQUEST,
		})

		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.post(
			'/api/user/search/user',
			{ search },
			config
		)

		data &&
			dispatch({
				type: SEARCH_USER_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: SEARCH_USER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const requestConnectionAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CONNECTION_USER_REQUEST,
		})

		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.post('/api/user/request', { id }, config)

		data &&
			dispatch({
				type: CONNECTION_USER_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: CONNECTION_USER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const cancelConnectionAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CANCEL_CONNECTION_USER_REQUEST,
		})

		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.post('/api/user/cancel', { id }, config)

		data &&
			dispatch({
				type: CANCEL_CONNECTION_USER_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: CANCEL_CONNECTION_USER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getPendingAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: GET_PENDING_REQUEST,
		})

		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.get('/api/user/pending', config)

		data &&
			dispatch({
				type: GET_PENDING_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: GET_PENDING_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const acceptFriendRequestAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ACCEPT_FRIEND_REQUEST,
		})

		const {
			userLogin: { userId },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userId.tokken}`,
			},
		}

		const { data } = await axios.post('/api/user/accept', { id }, config)

		data &&
			dispatch({
				type: ACCEPT_FRIEND_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: ACCEPT_FRIEND_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
