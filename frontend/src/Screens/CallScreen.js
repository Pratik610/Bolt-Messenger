import React, { useState, useContext, useEffect, useRef } from 'react'
import Peer from 'simple-peer'
import wrtc from 'wrtc'
import { SocketContext } from '../socket'
import { useSelector } from 'react-redux'
const CallScreen = () => {
	const socket = useContext(SocketContext)
	const [stream, setStream] = useState(null)
	const myVideo = useRef()
	const userVideo = useRef()

	const userUser = useSelector((state) => state.userInfo)
	const { user } = userUser

	const callUser = useSelector((state) => state.callUser)
	const { callData } = callUser

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
			})
			.then((currentStream) => {
				setStream(stream)
				myVideo.current.srcObject = currentStream
			})
	})

	useEffect(() => {
		// ........

		const peer = new Peer({
			initiator: callData.callerId === user._id ? true : false,
			wrtc: wrtc,
			trickle: false,
			stream,
		})

		peer.on('signal', (data) => {
			socket.emit('onGoingCall', {
				to: callData.callerId,
				signal: data,
			})
			console.log(data, user.name)
		})

		peer.on('stream', (currentStream) => {
			userVideo.current.srcObject = currentStream
			console.log('seting stream')
		})

		socket.on('onGoingCall', ({ signal }) => {
			peer.signal(signal)
			console.log(signal)
		})
	})

	return (
		<div
			style={{
				position: 'absolute',
				height: '100vh',
				zIndex: '7',
				backgroundColor: '#161819',
			}}
			className=' border w-100  p-md-2'>
			<div
				className='position-relative userCall   w-100  border'
				style={{ height: '90%', left: '50%' }}>
				<video
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					playsInline
					muted
					ref={userVideo}
					autoPlay
					className=''
				/>
				<div
					className='position-absolute  myvideo border'
					style={{ bottom: '0%', right: '0%' }}>
					{' '}
					<video
						style={{}}
						playsInline
						muted
						ref={myVideo}
						autoPlay
						className='w-100 h-100'></video>
				</div>
			</div>
			<div className='mx-auto controls  border d-flex align-content-center justify-content-around pt-2'>
				<button className='btn h5  btn-primary rounded-circle'>
					<i className='fas fa-microphone-slash'></i>
				</button>
				<button className='btn h5 btn-danger rounded-circle'>
					<i className='fas fa-bolt'></i>
				</button>
				<button className='btn h5 btn-warning rounded-circle'>
					<i className='fas fa-video-slash'></i>
				</button>
			</div>
		</div>
	)
}

export default CallScreen
