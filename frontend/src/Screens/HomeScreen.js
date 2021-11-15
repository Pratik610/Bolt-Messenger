import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserLoginInfo } from '../Actions/userActions'
import Chat from '../Components/Chat'

import Nav from '../Components/Nav'

import Search from '../Components/Search'

const HomeScreen = ({ history }) => {
	const dispatch = useDispatch()

	const userLogin = useSelector((state) => state.userLogin)
	const { userId } = userLogin

	const userInfo = useSelector((state) => state.userInfo)
	const { user } = userInfo

	useEffect(() => {
		if (!userId) {
			history.push('/login')
		}
		if (!user) {
			dispatch(getUserLoginInfo())
		}
	}, [dispatch, user, history, userId])

	return (
		<>
			{user && (
				<div className=' main container  p-md-3'>
					<div className='row home   '>
						<div
							className='col-12  p-0 col-lg-4 users-list h-100  '
							style={{ borderRadius: '15px' }}>
							<Nav user={user} />
							<div
								className='p-2  chats '
								style={{ backgroundColor: '#00171F' }}>
								<Search user={user} history={history} />
								<div className='p-1 pb-2 border-bottom'>
									<div className='mt-1  justify-content-between align-items-center ps-2 pe-2 d-flex'>
										<div>
											<img
												src={user.profilePhoto}
												alt=''
												width='50'
												referrerPolicy='no-referrer'
												className='rounded-circle'
											/>

											<h6
												style={{ fontSize: '1em', fontWeight: 'bold' }}
												className='d-inline ms-3'>
												Pratik
											</h6>
										</div>
										<div>
											<small
												className='text-muted'
												style={{ fontSize: '0.8em' }}>
												Yesterday
											</small>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Chat */}

						<Chat user={user} />

						{/* /Chat / */}
					</div>
				</div>
			)}
		</>
	)
}

export default HomeScreen
