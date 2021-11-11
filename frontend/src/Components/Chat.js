import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessageAction } from '../Actions/chatActions'
import { io } from 'socket.io-client'
const Chat = ({ user }) => {
	const [msg, setMsg] = useState('')
	const scrollRef = useRef()
	const socket = useRef()
	const dispatch = useDispatch()

	const getChat = useSelector((state) => state.getChat)
	const { chats } = getChat

	let reciver =
		chats &&
		chats.users.filter((id) => {
			return id._id !== user._id
		})
	reciver = reciver && reciver[0]

	useEffect(() => {
		socket.current = io()
		socket.current.on('getMessage', (data) => {
			console.log(data)
		})
	}, [])

	useEffect(() => {}, [chats])

	useEffect(() => {
		socket.current.emit('addUser', user._id)
		socket.current.on('getUsers', (users) => {
			console.log(users)
		})
	}, [user, socket])

	useEffect(() => {
		if (chats) {
			scrollRef?.current.scrollIntoView()
		}
	}, [chats])

	const send = (e) => {
		e.preventDefault()
		const reciverId = chats.users.find((u) => u._id !== user._id)
		socket.current.emit('sendMessage', {
			senderId: user._id,
			reciverId,
			message: msg,
		})
		dispatch(sendMessageAction(chats.convoId, msg))
	}

	return (
		<>
			<div
				style={{ borderRadius: '15px' }}
				className='d-none d-lg-block p-0 chats col-lg-8 position-relative '>
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
						{/* ..... */}

						<div
							style={{ position: 'sticky', top: '0%' }}
							className='d-flex nav  w-100  justify-content-between ps-4 pe-4  align-items-center p-3'>
							<div>
								{' '}
								<img
									src={reciver.profilePhoto}
									alt=''
									width='40'
									referrerPolicy='no-referrer'
									className='rounded-circle'
								/>
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
							style={{ overflowY: 'scroll', maxHeight: '80%' }}
							className='ps-md-3 pe-md-3 '>
							{chats.chats.map((msg) => (
								<div ref={scrollRef} key={msg._id}>
									<div
										className={`p-1 pe-2  d-flex ${
											user._id === msg.sender && 'justify-content-end'
										}`}>
										<p
											className=' mb-1  p-2'
											style={{
												maxWidth: '75%',
												wordWrap: 'break-word',
												backgroundColor: '#47489E',
												borderRadius: '20px',
											}}>
											<span>{msg.message}</span>
										</p>
									</div>
								</div>
							))}
						</div>
						<div
							style={{ bottom: '0%', zIndex: '3' }}
							className='position-absolute  p-2 w-100'>
							<form className='form-inline' onSubmit={send}>
								<div className='input-group mb-3'>
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
										id='button-addon2'>
										<i className='fas ps-2 pe-2 fa-bolt'></i>
									</button>
								</div>
							</form>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default Chat
