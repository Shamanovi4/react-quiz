import axios from 'axios'

export default axios.create({
	baseURL: 'https://react-quiz-382ea-default-rtdb.europe-west1.firebasedatabase.app/'
})