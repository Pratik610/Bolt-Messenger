import React, { useEffect } from 'react'
import { CALL_USER_DATA } from '../Constants/chatConstants'
const OutgoingCallNotification = ({
	outgoing,
	socket,
	dispatch,
	history,
	setOutgoing,
}) => {
	useEffect(() => {
		socket.on('callAccepted', ({ caller, user: userData }) => {
			dispatch({
				type: CALL_USER_DATA,
				payload: {
					callerId: caller,
					callerInfo: userData,
				},
			})
			history.push('/call')
		})
	})

	const cancelCall = () => {
		socket.emit('cancelCall', { reciver: outgoing.callingUser._id })
		setOutgoing((outgoing.active = false))
	}

	return (
		<div className='main-noti'>
			<div className='callNotification    p-2 '>
				<div
					className='d-flex align-items-center'
					style={{ backgroundColor: '#161819', borderRadius: '10px' }}>
					{' '}
					<div className='p-2 col-3'>
						<img
							src={outgoing.callingUser.profilePhoto}
							alt=''
							width='60'
							referrerPolicy='no-referrer'
							className='d-block mx-auto rounded-circle'
						/>{' '}
					</div>
					<div className='p-2 col-9'>
						<h6 className='p-1 mb-0 ' style={{ fontWeight: '500' }}>
							Calling {outgoing.callingUser.name}
						</h6>
						<div className='d-flex'>
							<div className='w-100 p-1'>
								<button className='btn btn-danger w-100 ' onClick={cancelCall}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default OutgoingCallNotification
