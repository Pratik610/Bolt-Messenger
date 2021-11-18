import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SEARCH_USER_RESET } from '../Constants/userConstants'
import {
	searchUsersAction,
	requestConnectionAction,
	cancelConnectionAction,
} from '../Actions/userActions'
import { getChatAction } from '../Actions/chatActions.js'
import Loader from './Loader'

const Search = ({ user, history }) => {
	const dispatch = useDispatch()

	const [name, setName] = useState('')

	const searchUser = useSelector((state) => state.searchUser)
	const { searched, loading } = searchUser

	const requestConnection = useSelector((state) => state.requestConnection)
	const { request } = requestConnection

	const cancelConnection = useSelector((state) => state.cancelConnection)
	const { cancel } = cancelConnection

	useEffect(() => {
		if (name.length > 0) {
			dispatch(searchUsersAction(name))
		} else {
			dispatch({
				type: SEARCH_USER_RESET,
			})
		}
	}, [request, dispatch, name, cancel])

	return (
		<>
			<div className=' border-bottom pb-2'>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='form-control serach'
					placeholder='Search or start new chat'
				/>
			</div>
			{loading && (
				<div key={user._id} className='p-1 pb-2 border-bottom'>
					<Loader />
				</div>
			)}
			{searched &&
				searched.map(
					(searchedUser) =>
						searchedUser._id !== user._id && (
							<div key={searchedUser._id}>
								<div className='p-1 d-none d-md-block pb-2 border-bottom'>
									<div className='mt-1  justify-content-between align-items-center ps-2 pe-2 d-flex'>
										<div>
											<img
												src={searchedUser.profilePhoto}
												alt=''
												width='50'
												referrerPolicy='no-referrer'
												className='rounded-circle'
											/>

											<h6
												style={{ fontSize: '1em', fontWeight: 'bold' }}
												className='d-inline ms-3'>
												{searchedUser.name}
											</h6>
										</div>
										{user.friends.find((id) => id === searchedUser._id) ? (
											<i
												className='fas h5 fa-comment-alt'
												onClick={() =>
													dispatch(getChatAction(searchedUser._id))
												}></i>
										) : (
											<div>
												{searchedUser.pendingRequest.find(
													(id) => id === user._id
												) ? (
													<i
														className='fas fa-user-times'
														onClick={() =>
															dispatch(cancelConnectionAction(searchedUser._id))
														}></i>
												) : (
													<i
														className='fas fa-user-plus'
														onClick={() =>
															dispatch(
																requestConnectionAction(searchedUser._id)
															)
														}></i>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						)
				)}
		</>
	)
}

export default Search
