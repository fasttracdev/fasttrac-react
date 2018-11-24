import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import Auth from '../../services/auth.js';
const auth = new Auth();

class Home extends Component {
	goTo(route) {
	  this.props.history.replace(`/${route}`)
	}

	login() {
		auth.login();
	}

	logout() {
		auth.logout();
	}
	render() {
		return (
			<div>
				<Navbar fluid>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">Auth0 - React</a>
						</Navbar.Brand>
						<Button
						bsStyle="primary"
						className="btn-margin"
						onClick={() =>this.goTo('home')}
						>
						Home
						</Button>
						{
							!auth.isAuthenticated() && (
							<Button
							bsStyle="primary"
							className="btn-margin"
							onClick={() =>this.login()}
							>
							Log In
							</Button>
							)
						}
						{
							auth.isAuthenticated() && (
							<Button
							bsStyle="primary"
							className="btn-margin"
							onClick={() => this.logout()}
							>
							Log Out
							</Button>
							)
						}
					</Navbar.Header>
				</Navbar>
			</div>
		);
	}
}

export default Home;