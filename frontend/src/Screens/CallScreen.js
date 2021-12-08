import React, { useState, useContext, useEffect, useRef } from 'react'
import Peer from 'simple-peer'
import wrtc from 'wrtc'
import { useHistory } from 'react-router'
import { SocketContext } from '../socket'
import { useSelector, useDispatch } from 'react-redux'
import { CALL_USER_RESET } from '../Constants/chatConstants'

const CallScreen = () => {
	const socket = useContext(SocketContext)
	const history = useHistory()

	let mic_switch = true
	let video_switch = true

	const [test, setTest] = useState(false)

	const stream = useRef()
	const myVideo = useRef()
	const userVideo = useRef()
	const connection = useRef()

	const dispatch = useDispatch()

	const userUser = useSelector((state) => state.userInfo)
	const { user } = userUser

	const callUser = useSelector((state) => state.callUser)
	const { callData } = callUser

	const endCall = () => {
		dispatch({
			type: CALL_USER_RESET,
		})

		socket.emit('endCall', { reciver: callData.callerInfo._id })
		window.location.reload()
	}

	useEffect(() => {
		socket.on('endCall', () => {
			connection.current.destroy()
			dispatch({
				type: CALL_USER_RESET,
			})
			window.location.reload()
		})
	}, [])

	useEffect(() => {
		if (!callData) {
			history.push('/')
		} else {
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true,
				})
				.then((currentStream) => {
					myVideo.current.srcObject = currentStream
					stream.current = currentStream
					const peer = new Peer({
						initiator: callData.callerId === user._id ? true : false,
						wrtc: wrtc,
						trickle: false,
						stream: stream.current,
					})

					peer.on('signal', (data) => {
						socket.emit('onGoingCall', {
							to: callData.callerInfo._id,
							signal: data,
						})
					})

					peer.on('error', (err) => {
						console.log(err)
					})

					peer.on('stream', (stream) => {
						userVideo.current.srcObject = stream
						console.log(stream)
						console.log(userVideo)
					})

					socket.on('onGoingCall', ({ signal }) => {
						peer.signal(signal)
						console.log(signal)
					})
					connection.current = peer
				})
		}
	}, [socket, callData])

	// ..............

	const toggleVideo = () => {
		if (stream != null && stream.current.getVideoTracks().length > 0) {
			video_switch = !video_switch
			stream.current.getVideoTracks()[0].enabled = video_switch
			setTest(!test)
			console.log(myVideo)
		}
	}

	const toggleMic = () => {
		if (stream != null && stream.current.getAudioTracks().length > 0) {
			mic_switch = !mic_switch

			stream.current.getAudioTracks()[0].enabled = mic_switch
		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				height: '100vh',
				zIndex: '7',
				backgroundColor: '#161819',
			}}
			className=' w-100  p-md-2'>
			<div
				className='position-relative userCall   w-100  '
				style={{ height: '100%', left: '50%' }}>
				<video
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					playsInline
					ref={userVideo}
					autoPlay
					className=''
				/>

				<div
					className='position-absolute  myvideo '
					style={{ top: '0%', right: '0%' }}>
					{stream.current.getVideoTracks()[0].enabled  && <p>wdwadwa</p>}
					<video
						style={{ objectFit: 'cover', borderRadius: '10px' }}
						playsInline
						ref={myVideo}
						autoPlay
						muted
						className='w-100 h-100'></video>
				</div>

				<div className='mx-auto position-absolute  controls   d-flex align-content-center justify-content-around pt-2'>
					<button
						className='btn h5 btn-dark rounded-circle'
						onClick={() => {
							toggleMic()
						}}>
						<i className='fas fa-microphone-slash'></i>
					</button>
					<button
						className='btn h5 btn-danger rounded-circle'
						onClick={endCall}>
						<i className='fas fa-bolt'></i>
					</button>
					<button
						className='btn h5  btn-dark rounded-circle'
						onClick={toggleVideo}>
						<i className='fas fa-video-slash'></i>
					</button>
				</div>
			</div>
		</div>
	)
}

export default CallScreen
