import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { USER_LOGOUT } from '../Constants/userConstants'
const Nav = ({ user }) => {
	const dispatch = useDispatch()
	const logout = () => {
		localStorage.clear('userId')
		dispatch({
			type: USER_LOGOUT,
		})
	}

	return (
		<div className='d-flex  nav ps-4 pe-4 justify-content-between align-items-center p-3'>
			<div>
				{' '}
				<img
					src={user.profilePhoto}
					alt=''
					width='40'
					referrerPolicy='no-referrer'
					className='rounded-circle'
				/>
			</div>
			<div>
				<div className='d-inline me-5'>
					<Link to='/notification' className='text-decoration-none text-light'>
						{user.pendingRequest.length > 0 ? (
							<i className='far fa-bell position-relative '>
								<span
									style={{ top: '0%', width: '5px', height: '5px' }}
									className='bg-danger  position-absolute rounded-circle '></span>
							</i>
						) : (
							<i className='far fa-bell position-relative '></i>
						)}
					</Link>
				</div>

				<div className='btn-group'>
					<i
						className='fas fa-ellipsis-v '
						type='button'
						data-bs-toggle='dropdown'
						aria-expanded='false'></i>
					<ul
						style={{ cursor: 'pointer' }}
						className=' dropdown-menu mt-3 bg-dark'>
						<div
							className='d-flex text-light justify-content-center align-items-centers'
							onClick={logout}>
							<div className='me-2'>
								<i className='fas fa-sign-out-alt'></i>
							</div>
							<div>Logout</div>
						</div>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Nav
