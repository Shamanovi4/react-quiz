import React from 'react'
import classes from './Input.module.scss'
import {MdClose, MdCheck, MdRadioButtonChecked} from 'react-icons/md'
import {FiCheckCircle, FiCircle} from 'react-icons/fi'
import {RiAlertFill} from 'react-icons/ri'
import RoundButton from '../RoundButton/RoundButton'

const Input = props => {
	const inputType = props.type || 'text'
	const htmlFor = `${inputType}-${Date.now()}${props.id}`
	const inputClasses = [
		classes.input,
		classes[props.className],
		props.isFormActive ? classes.active : '',
		!props.isValid && props.isTouched ? classes.validationError : ''
	]
	const inputWrapperClasses = [
		classes.inputWrapper,
		props.isActive ? classes.active : '',
		!props.isValid && props.isTouched ? classes.validationError : ''
	]
	const circleIcon = props.className === 'option' || props.className === 'addOption' ? <FiCircle className={classes.optionIcon}/> : ''
	const answerIcon = <MdRadioButtonChecked className={classes.optionAnswerIcon}/>
	const validationError = !props.isValid
			? <RoundButton
					className={'validationError'}
					isTooltip={true}
					tooltipValue={'Enter unique value'}
				>
					<RiAlertFill />
				</RoundButton>
			: ''
	const optionControls = props.className === 'option' && props.isFormActive
			? <div className={classes.optionControls}>
					{validationError}
					<RoundButton
						className={props.isRightOption ? 'active' : ''}
						onClick={props.onRightOption}
					>
						{props.isRightOption ? <FiCheckCircle /> : <MdCheck />}
					</RoundButton>
					<RoundButton
						onClick={props.onRemoveOption}
					>
						<MdClose />
					</RoundButton>
				</div>
			: ''
	const isReadOnly = props.className === 'addOption' || props.isReadOnly ? true : false
	const inputItemClassName = props.inputItemType === 'auth' ? classes['inputItem--auth'] :classes.inputItem
	const errorMessage = props.validationErrorMessage !== '' ? <span className={classes.validationErrorMessage}>{props.validationErrorMessage}</span> : ''

	return (
		<div 
			className={inputItemClassName}
			onClickCapture={props.onAnswer}
		>
			{errorMessage}
			<div className={classes.optionContent}>
				{props.isAnswer ? answerIcon : circleIcon}
				<div className={inputWrapperClasses.join(' ')} onClick={props.onClick}>
					<input 
						className={inputClasses.join(' ')}
						type={inputType}
						id={htmlFor}
						value={props.value}
						placeholder={props.placeholder}
						onChange={props.onChange}
						onClickCapture={props.onClickCapture}
						readOnly={isReadOnly}
					/>
				</div>
			</div>
			{optionControls}
		</div>
	)
}

export default Input
