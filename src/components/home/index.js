/**
 * Import section
 */
import React, { Component } from 'react';
import Auth from '../../services/auth.js';
import Environment from '../../environment/env' 
const auth = new Auth();
/**
 * Calss
 */
class Home extends Component {
	_env = new Environment();

	/**
	 * Login 
	 */
	login() {
		auth.login();
	}

	/**
	 * Render HTML
	 */
	render() {
		return (
			<div>
				<div className="container-scroller">
					<div className="container-fluid page-body-wrapper full-page-wrapper auth-page">
						<div className="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
							<div className="row w-100">
								<div className="col-lg-4 mx-auto">
									<div className="auto-form-wrapper">
										<div className="auth0-logo">
											<img src={this._env.getENV().ImagePath + "/images/auth0-logo-blue.png" } alt="auth0-logo"/>
										</div>
										<div className="form-group">
											<button className="btn btn-primary submit-btn btn-block" onClick={() => this.login()}>Login</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
/**
 * Export Section
 */
export default Home;