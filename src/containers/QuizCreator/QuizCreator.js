import React, {Component} from 'react'
import classes from './QuizCreator.module.scss'
import {connect} from 'react-redux'
import {quizCreationSave, quizCreationFinish, quizCreationReset} from '../../store/actions/create'
import Form from '../../components/UI/Form/Form'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import {createControl, validateForm} from '../../form/formFramework'
import Button from '../../components/UI/Button/Button'

function createFormControl(index) {
	return createControl({	
		id: index,
		className: 'question',
		isActive: true,
		isValid: true
	})
}

function createQuizControls(formsCount) {
	const formsArray = [formsCount]
	
	for (let i = 1; i <= formsCount; i++) {
		formsArray.push({[`question${i}`]: createFormControl(i)})
	}

	const forms = Object.assign(...formsArray)

	return {
		heading: createControl({
			id: 0,
			className: 'heading',
			isActive: false,
			isValid: true
		}),
		...forms
	}
}

function addToQuizControls(quizControls) {
	const newQuizControls = {...quizControls}
	const index = quizControls[Object.keys(quizControls)[Object.keys(quizControls).length - 1]].id + 1
	Object.assign(newQuizControls, {[`question${index}`]: createFormControl(index)})
	return newQuizControls
}

function removeFromQuizControls(quizControls, controlName) {
	const newQuizControls = {...quizControls}
	delete newQuizControls[controlName]
	return newQuizControls
}

class QuizCreator extends Component {
	state = {
		quiz: {},
		formsCount: 1,
		quizControls: createQuizControls(1),
		isValid: true
	}

	addQuestionHandler = () => {
		this.setState({
			formsCount: this.state.formsCount + 1,
			quizControls: addToQuizControls(this.state.quizControls)
		})
	}

	removeQuestionHandler = controlName => {
		this.setState({
			formsCount: this.state.formsCount - 1,
			quizControls: removeFromQuizControls(this.state.quizControls, controlName)
		})
	}

	toggleActiveHandler = controlName => {
		Object.keys(this.state.quizControls).forEach(controlName => {
			const control = this.state.quizControls[controlName]
			control.isActive = false
		})

		const quizControls = {...this.state.quizControls}
		const control = {...quizControls[controlName]}

		control.isActive = !control.isActive

		quizControls[controlName] = control

		this.setState({
			quizControls
		})
  }

	saveFormHandler = (key, id, className, formControls, rightOptionId) => {
		const formItem = {
			[key]: {
				id,
				className,
				formControls,
				rightOptionId,
				isReadOnly: true
			}
		}

		const	quiz = this.state.quiz
		Object.assign(quiz, formItem)
		
		this.setState({
			quiz
		}) 
	}

	validateFormHandler = (controlName, isValid) => {
		const quizControls = {...this.state.quizControls}
		const control = {...quizControls[controlName]}

		control.isValid = isValid
		quizControls[controlName] = control

		this.setState({
			quizControls,
			isValid: validateForm(quizControls),
		})
	}

	createQuizHandler = () => {
		this.props.quizCreationSave(this.state.quiz)
		this.props.quizCreationFinish()
		this.props.quizCreationReset()

		window.location.reload()
	}

	renderControls() {
		return Object.keys(this.state.quizControls).map(controlName => {
			const control = this.state.quizControls[controlName]

			return (
				<Auxiliary key={controlName + control.id}>
					<Form
						id={control.id}
						className={control.className}
						onAddQuestion={this.addQuestionHandler}
						onRemoveQuestion={() => this.removeQuestionHandler(controlName)}
						isActive={control.isActive}
						onClickCapture={() => this.toggleActiveHandler(controlName)}
						saveFormHandler={(formControls, rightOptionId) => this.saveFormHandler(controlName, control.id, control.className, formControls, rightOptionId)}
						validateFormHandler={(controlName, isValid) => this.validateFormHandler(controlName, isValid)}
					/>
				</Auxiliary>
			)
		})
	}

  render() {
    return (
      <div className={classes.quizCreator}>
				<div className={classes.quizCreatorInner}>
					{this.renderControls()}
					{this.state.isValid ? <Button onClick={() => this.createQuizHandler()}>Finish Quiz Creation</Button> : ''}
				</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		quiz: state.create.quiz
	}
}

function mapDispatchToProps(dispatch) {
	return {
		quizCreationSave: quiz => dispatch(quizCreationSave(quiz)),
		quizCreationFinish: () => dispatch(quizCreationFinish()),
		quizCreationReset: () => dispatch(quizCreationReset())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator)
