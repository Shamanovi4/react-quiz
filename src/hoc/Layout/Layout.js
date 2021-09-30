import React from 'react'
import Navigation from '../../containers/Navigation/Navigation'
import classes from './Layout.module.scss'

const Layout = props => {
	return (
		<div className={classes.layout}>	
			<header>
				<Navigation />
			</header>
			<main>
				{props.children}
			</main>
		</div>
	)
}

export default Layout
