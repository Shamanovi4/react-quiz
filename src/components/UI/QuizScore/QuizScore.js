import React from 'react'
import classes from './QuizScore.module.scss'

const QuizScore = props => {
  const cls = [
    classes.quizScore,
    classes[props.type]
  ]

  return (
    <div className={cls.join(' ')}>
      {props.children}
    </div>
  )
}

export default QuizScore