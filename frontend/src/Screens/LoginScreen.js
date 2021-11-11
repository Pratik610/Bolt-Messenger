import React, { useState, useEffect } from 'react'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import GoogleButton from 'react-google-button'
import { userLoginAction } from '../Actions/userActions.js'

const LoginScreen = ({ history }) => {
	const [clientID, setClientId] = useState('')
	const dispatch = useDispatch()

	const userLogin = useSelector((state) => state.userLogin)
	const { userId } = userLogin

	useEffect(() => {
		if (userId) {
			history.push('/')
		}

		const getClientId = async () => {
			const { data } = await axios.get('/api/user/client')
			data && setClientId(data)
		}
		getClientId()
	}, [history, userId])

	const successResponse = (response) => {
		dispatch(userLoginAction(response.profileObj))
		history.push('/')
	}
	const failResponse = (response) => {}

	return (
		<>
			<div className='container'>
				<div className='row'>
					<div className='login col-lg-4 col-md-6 col-12 offset-md-4'>
						<img
							src='./logo.png'
							width='100'
							className='d-block mx-auto'
							style={{ marginTop: '8vh' }}
							alt=''
						/>
						<h2 className='heading-1 mt-4 text-center'>Welcome to Bolt App</h2>
						<h6 className='heading-2 text-center'>
							A new way to connect with your favourite people
						</h6>
						<small className=' text-center d-block'>
							connect &#9679; chat &#9679; share{' '}
						</small>

						<div className='w-100 mt-3 p-2 d-flex  justify-content-center'>
							{clientID && (
								<GoogleLogin
									render={(renderProps) => (
										<GoogleButton
											className='heading-1 w-100'
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}>
											Sign in with Google
										</GoogleButton>
									)}
									clientId={clientID}
									buttonText='Login'
									onSuccess={successResponse}
									onFailure={failResponse}
									cookiePolicy={'single_host_origin'}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='d-md-none custom-shape-divider-bottom-1635130903'>
				<svg
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1200 120'
					preserveAspectRatio='none'>
					<path
						d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
						className='shape-fill'></path>
				</svg>
			</div>
		</>
	)
}

export default LoginScreen
