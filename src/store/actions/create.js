import {QUIZ_CREATION_RESET, QUIZ_CREATION_SAVE} from './actionTypes'
import axios from '../../axios/axios-quiz'

export function quizCreationReset() {
	return {
		type: QUIZ_CREATION_RESET
	}
}

export function quizCreationSave(quiz) {
	return {
		type: QUIZ_CREATION_SAVE,
		quiz
	}
}

export function quizCreationFinish() {
	return async (dispatch, getState) => {
		await axios.post('/quizes.json', JSON.stringify(getState().create.quiz))
	}
}
