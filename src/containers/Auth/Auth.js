import React, {Component} from 'react'
import classes from './Auth.module.scss'
import {connect} from 'react-redux'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Container from '../../components/UI/Container/Container'
import {auth} from '../../store/actions/auth'

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

class Auth extends Component {

	state = {
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				type: 'email',
				placeholder: 'Email',
				className: 'auth',
				validationErrorMessage: '',
				isValid: false,
				isTouched: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				placeholder: 'Password',
				className: 'auth',
				validationErrorMessage: '',
				isValid: false,
				isTouched: false,
				validation: {
					required: true,
					minLength: 8
				}
			}
		}
	}

	loginHandler = () => {
		if (this.state.isFormValid) {
			this.props.auth(
				this.state.formControls.email.value,
				this.state.formControls.password.value,
				true
			)
		}
	}

	registerHandler = () => {
		if (this.state.isFormValid) {
			this.props.auth(
				this.state.formControls.email.value,
				this.state.formControls.password.value,
				false
			)
		}
	}

	changeHandler = (value, controlName) => {
		const formControls = {...this.state.formControls}
		const control = {...formControls[controlName]}

		control.value = value
		control.isTouched = true

		if (!control.isTouched) return true
		if (!control.validation) return true

		control.isValid = true
		control.validationErrorMessage = ''

		if (control.validation.required) {
			if (control.value.trim() === '' && control.isValid) {
				control.isValid = false
				control.validationErrorMessage = 'Cannot be epmty!'
			}
		}
		if (control.validation.email) {
			if (!validateEmail(control.value) && control.isValid) {
				control.isValid = false
				control.validationErrorMessage = 'Email not valid!'
			}
		}
		if (control.validation.minLength) {
			if (control.value.length < control.validation.minLength && control.isValid) {
				control.isValid = false
				control.validationErrorMessage = 'Password minimum length is 8 characters!'
			}
		}

		formControls[controlName] = control

		let isFormValid = true

		Object.keys(formControls).forEach(name => {
			isFormValid = formControls[name].isValid && isFormValid
		})

		this.setState({
			formControls,
			isFormValid
		})
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

	renderInputs() {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName]

			return (
				<Input
					key={controlName + index}
					className={control.className}
					value={control.value}
					type={control.type}
					placeholder={control.placeholder}
					validationErrorMessage={control.validationErrorMessage}
					isValid={control.isValid}
					isTouched={control.isTouched}
					shouldValidate={!control.validation}
					onChange={event => this.changeHandler(event.target.value, controlName)}
					inputItemType={'auth'}
					isActive={control.isActive}
					onClickCapture={() => this.toggleActiveHandler(controlName)}
				/>
			)
		})
	}

  render() {
    return (
      <div className={classes.auth}>
        <div className={classes.authInner}>
					<Container>
						{this.renderInputs()}
					</Container>
					<Button onClick={this.loginHandler}>
						Log In
					</Button>
					<Button onClick={this.registerHandler}>
						Sign Up
					</Button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
	return {
		auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
	}
}

export default connect(null, mapDispatchToProps)(Auth)
