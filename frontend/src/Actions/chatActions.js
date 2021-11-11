import axios from 'axios'
import {
	GET_CHAT_FAIL,
	GET_CHAT_REQUEST,
	GET_CHAT_SUCCESS,
	SEND_MSG_FAIL,
	SEND_MSG_REQUEST,
	SEND_MSG_SUCCESS,
} from '../Constants/chatConstants.js'

export const getChatAction = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: GET_CHAT_REQUEST,
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
			'/api/chat/getchat',
			{ users: [userId._id, id] },
			config
		)

		data &&
			dispatch({
				type: GET_CHAT_SUCCESS,
				payload: data,
			})
	} catch (error) {
		dispatch({
			type: GET_CHAT_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const sendMessageAction =
	(convoId, msg) => async (dispatch, getState) => {
		try {
			dispatch({
				type: SEND_MSG_REQUEST,
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
				'/api/chat/sendmsg',
				{ convoId, msg },
				config
			)

			data &&
				dispatch({
					type: SEND_MSG_SUCCESS,
				})
		} catch (error) {
			dispatch({
				type: SEND_MSG_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			})
		}
	}
