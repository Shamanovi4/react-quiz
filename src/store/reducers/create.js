import {QUIZ_CREATION_RESET, QUIZ_CREATION_SAVE} from '../actions/actionTypes'

const initialState = {
	quiz: {}
}

export default function createReducer(state = initialState, action) {
	switch (action.type) {
		case QUIZ_CREATION_RESET:
			return {
				quiz: {}
			}
		case QUIZ_CREATION_SAVE:
			return {
				quiz: {...state.quiz, ...action.quiz}
			}
		default:
			return state
	}
}
