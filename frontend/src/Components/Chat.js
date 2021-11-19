import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessageAction } from '../Actions/chatActions'
import moment from 'moment-timezone'
import { io } from 'socket.io-client'
const Chat = ({ user, show, setShow }) => {
	const [msg, setMsg] = useState('')
	const [chatMessages, setChatMessages] = useState([])
	const [newMsg, setNewMsg] = useState(false)
	const scrollRef = useRef()
	const socket = useRef()
	const dispatch = useDispatch()

	const getChat = useSelector((state) => state.getChat)
	const { chats } = getChat

	const date = new Date()
	let reciver =
		chats &&
		chats.users.filter((id) => {
			return id._id !== user._id
		})
	reciver = reciver && reciver[0]

	useEffect(() => {
		socket.current = io('ws://localhost:5000', {
			transports: ['websocket', 'polling'],
		})
	}, [])

	useEffect(() => {
		socket.current.on('getMessage', (data) => {
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
		socket.current.emit('addUser', user._id)
		socket.current.on('getUsers', (users) => {
			// console.log(users)
		})
	}, [user, socket])

	useEffect(() => {
		if (chatMessages) {
			scrollRef.current?.scrollIntoView()
		}
	}, [chatMessages])

	const send = (e) => {
		e.preventDefault()
		const reciver = chats.users.find((u) => u._id !== user._id)

		setNewMsg({
			sender: user._id,
			message: msg,
			createdAt: date.toISOString(),
		})

		socket.current.emit('sendMessage', {
			sender: user._id,
			reciver: reciver._id,
			message: msg,
		})
		dispatch(sendMessageAction(chats.convoId, msg))
		setMsg('')
	}

	return (
		<>
			<div
				style={{ borderRadius: '15px' }}
				className={`p-0 chats d-md-block col-12 col-lg-8 position-relative ${
					!show && 'd-none'
				} `}>
				{!chats && (
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

				{chats && (
					<>
						{/* ..pc... */}

						<div
							id='msg'
							style={{ position: 'sticky', top: '0%' }}
							className='d-flex nav  w-100  justify-content-between ps-3 pe-4  align-items-center p-3'>
							<div>
								<div className='d-inline-block' onClick={() => setShow(false)}>
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

								<h6
									style={{ fontSize: '1em', fontWeight: 'bold' }}
									className='d-inline ms-3'>
									{reciver.name}
								</h6>
							</div>
							<div>
								<div className='me-4 d-inline'>
									<i className='fas fa-phone'></i>
								</div>
								<div className=' ms-4 d-inline'>
									<i className='fas fa-video'></i>
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
										<div
											className={`p-1 pe-2  d-flex ${
												user._id === msg.sender && 'justify-content-end'
											}`}>
											<p
												className={` mb-1 ps-3 pe-3  p-2 ${
													user._id === msg.sender
														? 'bottomLeftRadius'
														: 'bottomRightRadius'
												}`}
												style={{
													maxWidth: '75%',
													wordWrap: 'break-word',
													backgroundColor: '#47489E',
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
									</div>
								))}
							<div ref={scrollRef}></div>
						</div>
						<div
							style={{ bottom: '0%', zIndex: '3' }}
							className='position-absolute  p-2 w-100'>
							<form className='form-inline' onSubmit={send}>
								<div className='input-group mb-2'>
									<input
										type='text'
										value={msg}
										onChange={(e) => setMsg(e.target.value)}
										className='form-control sendmsg'
										aria-label="Recipient's username"
										aria-describedby='button-addon2'
									/>
									<button
										className='btn btn-outline-secondary'
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
