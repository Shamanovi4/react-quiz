import React, {Component} from 'react'
import Layout from './hoc/Layout/Layout'
import {Route, Switch, Redirect} from 'react-router-dom'
import Quiz from './containers/Quiz/Quiz'
import QuizList from './containers/QuizList/QuizList'
import Auth from './containers/Auth/Auth'
import QuizCreator from './containers/QuizCreator/QuizCreator'
import {connect} from 'react-redux'
import Logout from './components/Logout/Logout'
import {autoLogin} from './store/actions/auth'

class App extends Component {
	componentDidMount() {
		this.props.autoLogin()
	}

  render() {
		const routes = this.props.isAuthenticated
				? <Switch>
						<Route path='/quiz/:id' component={Quiz} />
						<Route path='/quiz-creator' component={QuizCreator} />
						<Route path='/logout' component={Logout} />
						<Route path='/' component={QuizList} />
						<Redirect to='/' />
					</Switch>
				: <Switch>
						<Route path='/auth' component={Auth} />
						<Redirect to='/auth' />
					</Switch>

    return (
      <Layout>
        {routes}
      </Layout>
    )
  }
}

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.auth.token
	}
}

function mapDispatchToProps(dispatch) {
	return {
		autoLogin: () => dispatch(autoLogin())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
