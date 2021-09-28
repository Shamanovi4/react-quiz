import React from 'react'
import classes from './Container.module.scss'

const Container = props => {
  const cls = [
    classes.container,
    classes[props.type]
  ]

  return (
    <div className={cls.join(' ')}>
			<div className={classes.containerWrapper}>
      	{props.children}
			</div>
    </div>
  )
}

export default Container