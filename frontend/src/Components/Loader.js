import React from 'react'
import ContentLoader from 'react-content-loader'
const Loader = (props) => {
	return (
		<div>
			<ContentLoader
				speed={1.5}
				className=''
				style={{ width: '100%', height: '70px' }}
				backgroundColor='#2d3034'
				foregroundColor='#b6afaf'
				{...props}>
				<circle cx='34' cy='35' r='25' />
				<rect x='75' y='27' rx='5' ry='5' width='220' height='15' />
				<rect x='341' y='31' rx='8' ry='8' width='59' height='7' />
			</ContentLoader>
		</div>
	)
}

export default Loader
