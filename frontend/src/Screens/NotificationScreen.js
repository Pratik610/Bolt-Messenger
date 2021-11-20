import React, { useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	getUserLoginInfo,
	getPendingAction,
	acceptFriendRequestAction,
} from '../Actions/userActions'
import { Link } from 'react-router-dom'
import Loader from '../Components/Loader'
import Chat from '../Components/Chat'
import { useHistory } from 'react-router'
import { SocketContext } from '../socket'

const NotificationScreen = () => {
	const socket = useContext(SocketContext)
	const history = useHistory()

	const [onlineUsers, setOnlineUsers] = useState([])

	const dispatch = useDispatch()

	const userLogin = useSelector((state) => state.userLogin)
	const { userId } = userLogin

	const userInfo = useSelector((state) => state.userInfo)
	const { user } = userInfo

	const pendingRequest = useSelector((state) => state.pendingRequest)
	const { pending, loading } = pendingRequest

	const acceptRequest = useSelector((state) => state.acceptRequest)
	const { accept } = acceptRequest

	useEffect(() => {
		if (!userId) {
			history.push('/login')
		} else {
			dispatch(getUserLoginInfo())
			dispatch(getPendingAction())
		}
	}, [dispatch, userId, history, accept])

	useEffect(() => {
		if (user) {
			socket.emit('addUser', user._id)
		}
		socket.on('getUsers', (users) => {
			setOnlineUsers(users)
		})
	}, [user, socket])

	return (
		<>
			{' '}
			{user && (
				<div className=' main container  p-md-3'>
					<div className='row home bg-dark  '>
						<div className='col-12  p-0 col-lg-4 users-list h-100  '>
							<Link
								style={{ fontSize: '1.1em' }}
								to='/'
								className='d-flex nav ps-3 text-decoration-none pe-4 back text-light  align-items-center p-3'>
								<div className=' pe-2 '>
									<i className='fas heading-1 fa-angle-left'></i>
									<i className='fas heading-1 fa-angle-left'></i>
								</div>
								<div>
									<p className=' d-inline heading-1'>Notification</p>
								</div>
							</Link>
							{loading && (
								<div className='p-2 pb-2 border-bottom'>
									<Loader />
								</div>
							)}

							{pending &&
								pending.map((pendinguser) => (
									<div key={pendinguser._id} className='p-2 pb-2 border-bottom'>
										<div className='mt-1  justify-content-between align-items-center ps-2 pe-2 d-flex'>
											<div>
												<img
													src={pendinguser.profilePhoto}
													alt=''
													width='45'
													className='rounded-circle'
												/>

												<h6
													style={{ fontSize: '1em', fontWeight: 'bold' }}
													className='d-inline ms-3'>
													{pendinguser.name}
												</h6>
											</div>
											<div>
												<button className='btn btn-outline-danger'>
													<i class='fas fa-trash '></i>
												</button>
												<button
													className='btn ms-2 btn-outline-success'
													onClick={() =>
														dispatch(acceptFriendRequestAction(pendinguser._id))
													}>
													<i class='fas fa-check'></i>
												</button>
											</div>
										</div>
									</div>
								))}
							{pending && pending.length === 0 && (
								<p className='heading-2 mt-5 text-center'>0 Notification</p>
							)}
						</div>
						{/* Chat */}

						<Chat
							displayNone={true}
							onlineUsers={onlineUsers}
							socket={socket}
							user={user}
						/>

						{/* /Chat / */}
					</div>
				</div>
			)}
		</>
	)
}

export default NotificationScreen
