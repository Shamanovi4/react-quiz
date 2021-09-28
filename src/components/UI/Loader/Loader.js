import React from 'react'
import classes from './Loader.module.scss'

const Loader = props => {
	return (
		<div className={classes.AlignCenter}>
			<div className={classes.LoaderSpinner}>
				<div className={classes.Loader}>
					<div /><div /><div /><div /><div />
				</div>
			</div>
		</div>
	)
}

export default Loader
