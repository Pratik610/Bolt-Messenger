import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserLoginInfo } from '../Actions/userActions'
import { getStackAction, getChatAction } from '../Actions/chatActions'
import Chat from '../Components/Chat'
import Nav from '../Components/Nav'
import Search from '../Components/Search'
import { useHistory } from 'react-router'
import { SocketContext } from '../socket'
import IncommingCallNotification from '../Components/IncommingCallNotification'
import OutgoingCallNotification from '../Components/OutgoingCallNotification'
import moment from 'moment-timezone'

const HomeScreen = () => {
	const socket = useContext(SocketContext)
	const history = useHistory()

	const [list, setList] = useState()
	const [show, setShow] = useState(false)
	const [onlineUsers, setOnlineUsers] = useState([])
	const [outgoing, setOutgoing] = useState({ callingUser: {}, active: false })

	const dispatch = useDispatch()

	const userLogin = useSelector((state) => state.userLogin)
	const { userId } = userLogin

	const userInfo = useSelector((state) => state.userInfo)
	const { user } = userInfo

	const getStack = useSelector((state) => state.getStack)
	const { stack } = getStack

	const searchUser = useSelector((state) => state.searchUser)
	const { searched } = searchUser

	useEffect(() => {
		if (!userId) {
			history.push('/login')
		}
		dispatch(getUserLoginInfo())
		dispatch(getStackAction())
	}, [dispatch, history, userId])

	useEffect(() => {
		if (stack) {
			setList(stack)
		}
	}, [stack, list])

	useEffect(() => {
		if (socket) {
			if (user) {
				socket.emit('addUser', user._id)
			}
			socket.on('getUsers', (users) => {
				setOnlineUsers(users)
			})
		}
	}, [user, socket])

	useEffect(() => {
		socket.on('getMessage', () => {
			dispatch(getStackAction())
		})
	}, [dispatch, socket])

	if (stack) {
		for (let index = 0; index < stack.stack.length; index++) {
			const temp = stack.stack[index].users.filter((u) => u !== user._id)

			stack.stack[index]['user'] = stack.users.find((u) => u._id === temp[0])
		}
	}

	return (
		<>
			{user && (
				<>
					{outgoing.active && (
						<OutgoingCallNotification
							outgoing={outgoing}
							history={history}
							socket={socket}
							dispatch={dispatch}
							setOutgoing={setOutgoing}
						/>
					)}
					<IncommingCallNotification
						socket={socket}
						user={user}
						dispatch={dispatch}
						history={history}
					/>
					<div className=' main container  p-md-3'>
						<div className='row home   '>
							<div
								className={`col-12  p-0 col-lg-4 users-list h-100 ${
									show && 'd-none'
								} `}
								style={{ borderRadius: '15px' }}>
								<Nav user={user} />
								<div
									className='p-2  chats '
									style={{ backgroundColor: '#00171F' }}>
									<Search user={user} setShow={setShow} />
									{list &&
										list.stack.map((stackMsg) => (
											<div
												key={stackMsg._id}
												className={`${searched && 'd-none'}`}>
												<div className='p-1 d-none d-md-block pb-2 border-bottom'>
													<div
														onClick={() =>
															dispatch(getChatAction(stackMsg.user._id))
														}
														style={{ cursor: 'pointer' }}
														className='mt-1  justify-content-between align-items-center ps-2 pe-2 d-flex'>
														<div className='d-flex align-items-center'>
															<img
																src={stackMsg.user.profilePhoto}
																alt=''
																width='50'
																referrerPolicy='no-referrer'
																className='rounded-circle'
															/>
															<div className=' ms-3'>
																<h6
																	className='mb-0 mt-1'
																	style={{
																		fontSize: '1em',
																		fontWeight: 'bold',
																	}}>
																	{stackMsg.user.name}
																</h6>
																<small
																	className='text-muted'
																	style={{ fontSize: '0.9em' }}>
																	{stackMsg.lastMessage && stackMsg.lastMessage}
																</small>
															</div>
														</div>
														<div>
															<small
																className='text-muted'
																style={{ fontSize: '0.8em' }}>
																{moment
																	.tz(
																		`${stackMsg.lastMessageTime}`,
																		'Asia/Kolkata'
																	)
																	.format()
																	.slice(11, 16)}
															</small>
														</div>
													</div>
												</div>
												{/* for mobile.... */}
												<div className='p-1 d-md-none  pb-2 border-bottom'>
													<div
														onClick={() => {
															dispatch(getChatAction(stackMsg.user._id))
															setShow(true)
														}}
														style={{ cursor: 'pointer' }}
														className='mt-1  justify-content-between align-items-center ps-2 pe-2 d-flex'>
														<div className='d-flex align-items-center'>
															<img
																src={stackMsg.user.profilePhoto}
																alt=''
																width='50'
																referrerPolicy='no-referrer'
																className='rounded-circle'
															/>
															<div className=' ms-3'>
																<h6
																	className='mb-0 mt-1'
																	style={{
																		fontSize: '1em',
																		fontWeight: 'bold',
																	}}>
																	{stackMsg.user.name}
																</h6>
																<small
																	className='text-muted'
																	style={{ fontSize: '0.9em' }}>
																	{stackMsg.lastMessage && stackMsg.lastMessage}
																</small>
															</div>
														</div>
														<div>
															<small
																className='text-muted'
																style={{ fontSize: '0.8em' }}>
																{stackMsg.lastMessageTime &&
																	stackMsg.lastMessageTime.slice(15, 21)}
															</small>
														</div>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
							{/* Chat */}

							<Chat
								socket={socket}
								setOutgoing={setOutgoing}
								onlineUsers={onlineUsers}
								user={user}
								show={show}
								setShow={setShow}
							/>

							{/* /Chat / */}
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default HomeScreen
