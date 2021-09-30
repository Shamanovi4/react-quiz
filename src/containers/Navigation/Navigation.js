import React, {Component} from 'react'
import classes from './Navigation.module.scss'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'

class Navigation extends Component {
  state = {
    menu: false
  }

  toggleMenuHandler = () => {
    this.setState({
      menu: !this.state.menu
    })
  }

  menuCloseHandler = () => {
    this.setState({
      menu: false
    })
  }

	renderLinks(links) {
		return links.map((link, index) => {
			return (
				<div className={classes.navigationGroupItem} key={index}>
					<NavLink
							to={link.to}
							exact={link.exact}
							className={classes.link}
					>
						{link.label}
					</NavLink>
				</div>
			)
		})
	}

  render() {
		const navLinks = this.props.isAuthenticated
				? [ 
						{to: '/', exact: true, label: 'Quiz List'},
						{to: '/quiz-creator', exact: false, label: 'Quiz Creator'},
					]
				: []
		const authLinks = this.props.isAuthenticated
				? [ 
						{to: '/logout', exact: false, label: 'Log Out'},
					]
				: [
						{to: '/auth', exact: false, label: 'Authorization'},
					]

    return (
      <div className={classes.navigation}>
				<div className={classes.navigationGroup}>
						{this.renderLinks(navLinks)}
					</div>
					<div className={classes.navigationGroup}>
						{this.renderLinks(authLinks)}
					</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.auth.token
	}
}

export default connect(mapStateToProps)(Navigation)
