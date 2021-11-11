import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SEARCH_USER_RESET } from '../Constants/userConstants'
import {
	searchUsersAction,
	requestConnectionAction,
	cancelConnectionAction,
} from '../Actions/userActions'
import { getChatAction } from '../Actions/chatActions.js'
import Loader from './Loader'

const Search = ({ user }) => {
	const dispatch = useDispatch()

	const searchUser = useSelector((state) => state.searchUser)
	const { searched, loading } = searchUser

	const search = (e) => {
		if (e.target.value.length > 0) {
			dispatch(searchUsersAction(e.target.value))
		} else {
			dispatch({
				type: SEARCH_USER_RESET,
			})
		}
	}

	return (
		<>
			<div className=' border-bottom pb-2'>
				<input
					type='text'
					onChange={search}
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
							<div key={searchedUser._id} className='p-1 pb-2 border-bottom'>
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
														dispatch(requestConnectionAction(searchedUser._id))
													}></i>
											)}
										</div>
									)}
								</div>
							</div>
						)
				)}
		</>
	)
}

export default Search
