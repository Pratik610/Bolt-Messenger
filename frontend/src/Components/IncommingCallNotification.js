import React, { useState, useEffect } from 'react'
import { CALL_USER_DATA } from '../Constants/chatConstants'
const IncommingCallNotification = ({ user, socket, history, dispatch }) => {
	const [incoming, setIncoming] = useState(false)
	const [callerId, setCallerId] = useState({})
	const [callerInfo, setCallerInfo] = useState({})

	useEffect(() => {
		socket.on('callUser', ({ caller, user: callerData }) => {
			setIncoming(true)
			setCallerId(caller)
			setCallerInfo(callerData)
		})
	})

	const acceptCall = () => {
		socket.emit('answerCall', { user, caller: callerId, reciver: callerId })
		dispatch({
			type: CALL_USER_DATA,
			payload: {
				callerId,
				callerInfo,
			},
		})
		history.push('/call')
	}

	const rejectCall = () => {
		socket.emit('rejectCall', { reciver: callerId })
		setIncoming(false)
	}

	return (
		<div className={`main-noti ${!incoming && 'd-none'}`}>
			<div className='callNotification    p-2 '>
				<div
					className='d-flex align-items-center'
					style={{ backgroundColor: '#161819', borderRadius: '10px' }}>
					{' '}
					<div className='p-2 col-3'>
						<img
							src={callerInfo.profilePhoto}
							alt=''
							width='60'
							referrerPolicy='no-referrer'
							className='d-block mx-auto rounded-circle'
						/>{' '}
					</div>
					<div className='p-2 col-9'>
						<h6 className='p-1 ' style={{ fontWeight: '500' }}>
							Incoming Call from {callerInfo.name}
						</h6>
						<div className='d-flex'>
							<div className='w-50 p-1'>
								<button className='btn btn-danger w-100 ' onClick={rejectCall}>
									Reject
								</button>
							</div>
							<div className='w-50 p-1'>
								<button className='btn btn-success  w-100' onClick={acceptCall}>
									Answer
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default IncommingCallNotification
