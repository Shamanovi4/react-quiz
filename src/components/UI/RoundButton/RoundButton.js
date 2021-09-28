import React from 'react'
import classes from './RoundButton.module.scss'

const RoundButton = props => {
  const buttonClasses = [
		classes.roundButton,
		classes[props.className],
  ]

	const tooltip = props.isTooltip
				? <span className={classes.tooltip}>{props.tooltipValue}</span>
				: ''

  return (
    <button
      onClick={props.onClick}
      className={buttonClasses.join(' ')}
    >
      {props.children}
			{tooltip}
    </button>
  )
}

export default RoundButton