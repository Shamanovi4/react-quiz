import React, {Component} from 'react'
import classes from './Form.module.scss'
import Input from '../Input/Input'
import {createControl, validateForm} from '../../../form/formFramework'
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary'
import RoundButton from '../RoundButton/RoundButton'
import {MdAddCircleOutline} from 'react-icons/md'
import {FaRegTrashAlt} from 'react-icons/fa'

function createOptionControl(index) {
	return createControl({
		id: index,
		className: 'option',
		placeholder: `Option ${index}`,
		isActive: false,
		value: '',
		isValid: true
	})
}

function createQuestionControls(optionsCount) {
	const optionsArray = [optionsCount]
	
	for (let i = 1; i <= optionsCount; i++) {
		optionsArray.push({[`option${i}`]: createOptionControl(i)})
	}

	const options = Object.assign(...optionsArray)

	return {
		question: createControl({
			id: 0,
			className: 'question',
			placeholder: 'Question',
			isActive: false,
			value: '',
		}),
		...options
	}
}

function createHeadingControl() {
	return {
		heading: createControl({
			id: 0,
			className: 'heading',
			placeholder: 'New Quiz',
			isActive: false,
			value: '',
		})
	}
}

function addToFormControls(formControls) {
	const newFormControls = {...formControls}
	const index = formControls[Object.keys(formControls)[Object.keys(formControls).length - 1]].id + 1
	Object.assign(newFormControls, {[`option${index}`]: createOptionControl(index)})
	return newFormControls
}

function removeFromFormControls(formControls, controlName) {
	const newFormControls = {...formControls}
	delete newFormControls[controlName]
	return newFormControls
}

class Form extends Component {
	state = {
		formControls: this.props.className === 'question' && !this.props.isQuiz
				? createQuestionControls(1)
				: createHeadingControl(),
		optionsCount: 1,
		rightOptionId: 1,
		isValid: false,
	}

	componentDidMount() {
		if(this.props.saveFormHandler) {
			this.props.saveFormHandler(this.state.formControls, this.state.rightOptionId)
		}

		if(this.props.formControls) {
			let formControls = this.props.formControls
			const question = formControls.question

			if (question) {
				delete formControls['question']
				formControls = {question, ...formControls}
			}

			this.setState({
				formControls
			})
		}
	}

	submitHandler = event => {
		event.preventDefault()
	}

	addOptionHandler = () => {
		this.setState({
			optionsCount: this.state.optionsCount + 1,
			formControls: addToFormControls(this.state.formControls)
		})

		this.props.saveFormHandler(this.state.formControls, this.state.rightOptionId)
	}

	removeOptionHandler = controlName => {
		this.setState({
			optionsCount: this.state.optionsCount - 1,
			formControls: removeFromFormControls(this.state.formControls, controlName)
		})

		this.props.saveFormHandler(this.state.formControls, this.state.rightOptionId)
	}

	changeHandler = (value, controlName) => {
		const formControls = {...this.state.formControls}
		formControls[controlName].value = value

		Object.keys(formControls).forEach(controlName => {
			const control = {...formControls[controlName]}
			let isValid = true

			Object.keys(formControls).forEach(controlName => {
				if (control.value === formControls[controlName].value && 
						control.id !== formControls[controlName].id &&
						control.id !== 0 &&
						formControls[controlName].id !== 0 &&
						control.value !== ''
						) isValid = false
			})

			control.isValid = isValid
			formControls[controlName] = control
		})

		const isFormValid = validateForm(formControls)

		this.setState({
			formControls,
			isValid: isFormValid,
		})

		this.props.saveFormHandler(formControls, this.state.rightOptionId)
		if (this.props.className === 'heading') {
			this.props.validateFormHandler(this.props.className, isFormValid)
		} else {
			this.props.validateFormHandler(this.props.className + this.props.id, isFormValid)
		}
	}

	toggleActiveHandler = controlName => {
		if (!this.props.isQuiz) {
			Object.keys(this.state.formControls).forEach(controlName => {
				const control = this.state.formControls[controlName]
				control.isActive = false
			})
	
			const formControls = {...this.state.formControls}
			const control = {...formControls[controlName]}
	
			control.isActive = !control.isActive
	
			formControls[controlName] = control
	
			this.setState({
				formControls
			})
		}
  }

	toggleAnswerHandler = controlName => {
		if (controlName !== 'question' && this.props.isQuiz) {
			Object.keys(this.state.formControls).forEach(controlName => {
				const control = this.state.formControls[controlName]
				control.isAnswer = false
			})
	
			const formControls = {...this.state.formControls}
			const control = {...formControls[controlName]}
	
			control.isAnswer = !control.isAnswer
	
			formControls[controlName] = control
	
			this.setState({
				formControls
			})

			this.props.onAnswerHandler(this.props.className + this.props.id, control.id)
		}
  }

	resetActive = () => {
		if (!this.props.isActive) {
			Object.keys(this.state.formControls).forEach(controlName => {
				const control = this.state.formControls[controlName]
				control.isActive = false
			})
		}
	}

	rightOptionHandler = controlName => {
		const control = this.state.formControls[controlName]

		this.setState({
			rightOptionId: control.id,
		})

		this.props.saveFormHandler(this.state.formControls, control.id)
	}

	renderControls() {
		return Object.keys(this.state.formControls).map(controlName => {
			const control = this.state.formControls[controlName]
			const isRightOption = control.id === this.state.rightOptionId ? true : false
			const isActive = this.props.isQuiz ? '' : control.isActive
			const isFormActive = this.props.isQuiz ? '' : this.props.isActive
			const onRemoveOption = this.props.isQuiz ? '' : () => this.removeOptionHandler(controlName)
			const onRightOption = this.props.isQuiz ? '' : () => this.rightOptionHandler(controlName)

			return (
				this.props.className === 'question'
						?	<Auxiliary key={controlName + control.id}>
								<Input
									id={control.id}
									className={control.className}
									value={control.value}
									placeholder={control.placeholder}
									onChange={event => this.changeHandler(event.target.value, controlName)}
									onClickCapture={() => this.toggleActiveHandler(controlName)}
									isActive={isActive}
									isFormActive={isFormActive}
									onRemoveOption={onRemoveOption}
									isRightOption={isRightOption}
									onRightOption={onRightOption}
									isValid={control.isValid}
									isReadOnly={this.props.isReadOnly}
									isAnswer={control.isAnswer}
									onAnswer={() => this.toggleAnswerHandler(controlName)}
								/>
							</Auxiliary>
						: <Auxiliary key={controlName + control.id}>
								<Input
									id={control.id}
									className={control.className}
									value={control.value}
									placeholder={control.placeholder}
									onChange={event => this.changeHandler(event.target.value, controlName)}
									onClickCapture={() => this.toggleActiveHandler(controlName)}
									isActive={control.isActive}
									isFormActive={this.props.isActive}
									isReadOnly={this.props.isReadOnly}
								/>
							</Auxiliary>
			)
		})
	}

  render() {
		if (!this.props.isQuiz) this.resetActive()

		const formItemClasses = [
			classes.formItem,
			this.props.className === 'heading' ? classes.heading : '',
		]
		const formItemWrapperClasses = [
			classes.formItemWrapper,
			this.props.className === 'heading' ? classes.heading : '',
			this.props.isActive ? classes.active : ''
		]
		const formContent = this.props.className === 'question' && this.props.isActive
				? <div className={formItemWrapperClasses.join(' ')}>
						{this.renderControls()}
						<Input
							id='addOption'
							className='addOption'
							value='Add another option'
							onClick={this.addOptionHandler}
						/>
						<div className={classes.controlPanel}>
							<div className={classes.buttonsGroup}>
								<RoundButton onClick={this.props.onAddQuestion}>
									<MdAddCircleOutline />
								</RoundButton>
								<RoundButton onClick={this.props.onRemoveQuestion}>
									<FaRegTrashAlt />
								</RoundButton>
							</div>
						</div>
					</div>
				: <div className={formItemWrapperClasses.join(' ')}>
						{this.renderControls()}
					</div>

    return (
			<form 
				className={formItemClasses.join(' ')} 
				onSubmit={this.submitHandler}
				onClickCapture={this.props.onClickCapture} 
			>
				{formContent}
			</form>
    )
  }
}

export default Form
