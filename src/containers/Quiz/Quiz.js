import React, {Component} from 'react'
import classes from './Quiz.module.scss'
import Loader from '../../components/UI/Loader/Loader'
import Form from '../../components/UI/Form/Form'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import {connect} from 'react-redux'
import {fetchQuizById} from '../../store/actions/quiz'
import Button from '../../components/UI/Button/Button'
import Container from '../../components/UI/Container/Container'
import QuizScore from '../../components/UI/QuizScore/QuizScore'

class Quiz extends Component {
	state = {
		quizAnswers: {},
		quizScore: null
	}
	
	componentDidMount() {
		this.props.fetchQuizById(this.props.match.params.id)
	}

	countQuizScore() {
		let quizScore = 0

		Object.keys(this.state.quizAnswers).forEach(questionName => {
			if (this.state.quizAnswers[questionName].answerId === this.props.quiz.quiz[questionName].rightOptionId) quizScore += 1
		})

		this.setState({
			quizScore
		})
	}

	answerHandler = (questionName, answerId) => {
		if (!(questionName in this.state.quizAnswers)) {
			const answer = {
				[questionName]: {
					answerId
				}
			}

			const quizAnswers = {...this.state.quizAnswers, ...answer}
			
			this.setState({
				quizAnswers
			})
		} else {
			const quizAnswers = {...this.state.quizAnswers}
			const answer = {...quizAnswers[questionName]}

			answer.answerId = answerId
			quizAnswers[questionName] = answer

			this.setState({
				quizAnswers
			})
		}
	}

	quizRetry() {
		window.location.reload()
	}

	renderControls(quiz) {
		return Object.keys(quiz).map((key) => {
			const control = {...quiz[key]}

			return (
				<Auxiliary key={key}>
					<Form
						id={control.id}
						className={control.className}
						formControls={control.formControls}
						isQuiz={true}
						isReadOnly={control.isReadOnly}
						onAnswerHandler={(questionName, answerId) => this.answerHandler(questionName, answerId)}
					/>
				</Auxiliary>
			)
		})
	}

  render() {
		const quiz = this.props.quiz.quiz ? {...this.props.quiz.quiz} : ''

    return (
      <div className={classes.quiz}>
				<div className={classes.quizInner}>
					{this.props.loading || !this.props.quiz
							? <Container>
									<Loader />
								</Container>
							: this.state.quizScore === null
									? this.renderControls(quiz)
									: <Container>
											<QuizScore>Score: {this.state.quizScore} out of {Object.keys(this.state.quizAnswers).length}</QuizScore>
										</Container>
					}
					{!this.props.loading && this.state.quizScore === null 
							? <Button onClick={() => this.countQuizScore()}>Finish Quiz</Button> 
							: <Button onClick={() => this.quizRetry()}>Retry Quiz</Button>
					}
				</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		quiz: state.quiz,
		loading: state.quiz.loading
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchQuizById: id => dispatch(fetchQuizById(id)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz)
