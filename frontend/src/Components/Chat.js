import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	sendMessageAction,
	getStackAction,
	getChatAction,
} from '../Actions/chatActions'
import moment from 'moment-timezone'
import axios from 'axios'

const Chat = ({
	socket,
	user,
	show,
	setShow,
	displayNone,
	onlineUsers,
	setOutgoing,
}) => {
	const [msg, setMsg] = useState('')
	const [chatMessages, setChatMessages] = useState([])
	const [newMsg, setNewMsg] = useState(false)
	const scrollRef = useRef()

	const [fileLoading, setFileLoading] = useState(false)

	const dispatch = useDispatch()

	const getChat = useSelector((state) => state.getChat)
	const { chats, loading } = getChat

	const userLogin = useSelector((state) => state.userLogin)
	const { userId } = userLogin

	const date = new Date()
	let reciver =
		chats &&
		chats.users.filter((id) => {
			return id._id !== user._id
		})
	reciver = reciver && reciver[0]

	useEffect(() => {
		socket.on('getMessage', (data) => {
			setNewMsg({
				sender: data.sender,
				message: data.message,
				createdAt: date.toISOString(),
			})
		})
	}, [])

	useEffect(() => {
		chats && setChatMessages(chats.chats)
	}, [chats])

	useEffect(() => {
		newMsg && setChatMessages([...chatMessages, newMsg])
	}, [newMsg])

	useEffect(() => {
		if (chatMessages) {
			scrollRef.current?.scrollIntoView()
		}
	}, [chatMessages])

	const callUser = () => {
		socket.emit('callUser', { reciver: reciver._id, user, caller: user._id })
		setOutgoing({ callingUser: reciver, active: true })
	}

	const send = (e) => {
		e.preventDefault()
		const reciver = chats.users.find((u) => u._id !== user._id)

		setNewMsg({
			sender: user._id,
			message: msg,
			createdAt: date.toISOString(),
		})

		socket.emit('sendMessage', {
			sender: user._id,
			reciver: reciver._id,
			message: msg,
			convoId: chats.convoId,
		})
		dispatch(sendMessageAction({ convoId: chats.convoId, msg }))
		setMsg('')
		dispatch(getStackAction())
	}

	const sendFile = async (e) => {
		setFileLoading(true)
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('file', file)
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${userId.tokken}`,
				},
			}
			const { data } = await axios.post('/api/upload', formData, config)
			if (data) {
				dispatch(
					sendMessageAction({ convoId: chats.convoId, msg: data, type: 'file' })
				)
				dispatch(getChatAction(reciver._id))
			}
			setFileLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<div
				style={{ borderRadius: '15px' }}
				className={`p-0 chats  d-md-block col-12 col-lg-8 position-relative ${
					!show && 'd-none'
				} ${displayNone && 'd-none'} `}>
				{!chats && !loading && (
					<div className='d-flex pb-5 justify-content-center h-100 align-items-center'>
						<div>
							<i
								style={{ fontSize: '10em' }}
								className='d-block text-center mb-5 fas fa-bolt'></i>
							<p>
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry.{' '}
							</p>
						</div>
					</div>
				)}
				{fileLoading ||
					(!chats && (
						<div className=' w-100 h-100'>
							<div className='w-100 h-100 d-flex justify-content-center align-items-center'>
								<div className='cube'>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
					))}

				{chats && !fileLoading && (
					<>
						{/* ..pc... */}

						<div
							id='msg'
							style={{ position: 'sticky', top: '0%' }}
							className='d-flex nav  w-100  justify-content-between ps-3 pe-4  align-items-center p-3'>
							<div className='d-flex align-items-center'>
								<div className='' onClick={() => setShow(false)}>
									<div className='pe-3 d-inline-block d-md-none'>
										<i className='fas fa-angle-left '></i>
									</div>
									<img
										src={reciver.profilePhoto}
										alt=''
										width='40'
										referrerPolicy='no-referrer'
										className='rounded-circle '
									/>
								</div>
								<div className=' ms-3'>
									<h6
										style={{ fontSize: '1em', fontWeight: 'bold' }}
										className='d-inline mb-0 '>
										{reciver.name}
									</h6>
									{onlineUsers.find((u) => u.userId === reciver._id) && (
										<small className='d-block'>online</small>
									)}
								</div>
							</div>
							<div>
								<div className='me-3 d-inline'>
									{onlineUsers.find((u) => u.userId === reciver._id) ? (
										<i onClick={callUser} className='fas fa-phone'></i>
									) : (
										<i
											onClick={() => window.alert('User is Offline')}
											className='fas fa-phone'></i>
									)}
								</div>
							</div>
						</div>

						{/* ....... */}
						<div
							style={{ overflowY: 'scroll', height: '80%' }}
							className='ps-md-3 pe-md-3 p-2  '>
							{chatMessages &&
								chatMessages.map((msg) => (
									<div key={msg._id}>
										{msg.type === 'text' ? (
											<div
												className={`p-1 pe-2  d-flex ${
													user._id === msg.sender && 'justify-content-end'
												}`}>
												<p
													ref={scrollRef}
													className={` mb-1 ps-3 pe-3  p-2 ${
														user._id === msg.sender
															? 'bottomLeftRadius bg-sender'
															: 'bottomRightRadius bg-reciver '
													}`}
													style={{
														maxWidth: '75%',
														wordWrap: 'break-word',
														borderTopLeftRadius: '20px',
														borderTopRightRadius: '20px',
													}}>
													<span
														style={{ lineHeight: '' }}
														className='d-inline-block pb-0 mb-0'>
														{msg.message}
													</span>
													<span
														className=' d-inline-block  ms-2  '
														style={{
															marginBottom: '-5px',
															fontSize: '0.6em',
															lineHeight: '0.2em',
														}}>
														{/* {msg.createdAt && msg.createdAt.slice(11, 16)} */}
														{moment
															.tz(`${msg.createdAt}`, 'Asia/Kolkata')
															.format()
															.slice(11, 16)}
													</span>
												</p>
											</div>
										) : (
											<a
												href={`${msg.message}`}
												download
												className='text-decoration-none  text-light'>
												<div
													className={` d-flex mb-1 ${
														user._id === msg.sender && 'justify-content-end'
													}`}>
													<div
														className={`ps-3 pe-3 p-2 pt-3 d-flex file justify-content-between align-items-center ${
															user._id === msg.sender
																? ' bg-sender'
																: ' bg-reciver '
														}`}
														style={{
															borderRadius: '10px',
														}}>
														<div className='col-10'>
															<h4
																className=''
																style={{
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																}}>
																<i className='fas fa-file me-md-3 me-2'></i>
																<span style={{ fontSize: '0.8em' }}>
																	{msg.message.slice(9)}
																</span>
															</h4>
														</div>

														<h4 className='col-2 text-center'>
															<i className='fas fa-download'></i>
														</h4>
													</div>
												</div>
											</a>
										)}
									</div>
								))}
						</div>
						<div
							style={{ bottom: '0%', zIndex: '3' }}
							className='position-absolute  p-2 w-100'>
							<form className='form-inline' onSubmit={send}>
								<div className='input-group mb-2'>
									<input
										type='file'
										onChange={sendFile}
										hidden
										id='file'
										name='file'
									/>
									<button
										onClick={() => document.getElementById('file').click()}
										className='btn btn-success rounded-circle me-1'
										type='button'
										id='button-addon2'>
										<i className='fas fa-plus'></i>
									</button>
									<input
										type='text'
										value={msg}
										onChange={(e) => setMsg(e.target.value)}
										className='form-control sendmsg'
										aria-label="Recipient's username"
										aria-describedby='button-addon2'
									/>
									<button
										className='btn btn-success'
										type='submit'
										disabled={msg === '' ? true : false}
										id='button-addon2'>
										<i className='fas ps-2 pe-2 fa-bolt'></i>
									</button>
								</div>
							</form>
						</div>
						{/* pc ends */}
					</>
				)}
			</div>
		</>
	)
}

export default Chat
