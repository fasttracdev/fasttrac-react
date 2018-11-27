/**
 * Import section
 */
import React, { Component } from 'react';
import Auth from '../../../services/auth';
import { withRouter } from "react-router";

const auth = new Auth();

/**
 * Class declaration
 */
class Topbar extends Component {

	isActiveDropDown = false;

	/**
	 * Send to to route
	 * @param {*} route 
	 */
	gotoRoute(route) {
		this.props.history.push(route);
	}

	/**
	 * Drop Down Handling 
	 */
	openCloseDropDown() {
		this.isActiveDropDown = !this.isActiveDropDown;
	}

	/**
	 * Logout 
	 */
	signOut() {
		auth.logout();
	}

	/**
	 * Render HTML
	 */
	render() {
		const { user } = this.props;
		return (
			<nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
			    <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
			        <a className="navbar-brand brand-logo sidebar-link" onClick={() => { this.gotoRoute('/admin/dashboard') }}>
			        <img src="../../src/images/logo.png" alt="logo" />
			        </a>
			        <a className="navbar-brand brand-logo-mini sidebar-link" onClick={() => { this.gotoRoute('/admin/dashboard') }}>
			        <img src="../../src/images/logo.png" alt="logo" />
			        </a>
			    </div>
			    <div className="navbar-menu-wrapper d-flex align-items-center">				   
					<ul className="navbar-nav navbar-nav-right">
					        <li className={ !this.isActiveDropDown ? "nav-item dropdown d-none d-xl-inline-block" : "nav-item dropdown d-none d-xl-inline-block show"}>
					        <a className="nav-link dropdown-toggle" id="UserDropdown" onClick={() => { this.openCloseDropDown(); }} href="#" data-toggle="dropdown" aria-expanded="false">
					        <span className="profile-text">Hello, {user.user_metadata.first_name + ' ' + user.user_metadata.last_name} !</span>
					        <img className="img-xs rounded-circle" src={user.picture} alt="Profile image" />
					        </a>
					        <div className={!this.isActiveDropDown ? "dropdown-menu dropdown-menu-right navbar-dropdown" : "dropdown-menu dropdown-menu-right navbar-dropdown show"} aria-labelledby="UserDropdown">
					        <a className="dropdown-item mt-2">
					        Manage Accounts
					        </a>
					        <a className="dropdown-item">
					        Change Password
					        </a>
					        <a className="dropdown-item">
					        Check Inbox
					        </a>
					        <a className="dropdown-item" onClick={()=> { this.signOut(); }}>
					        Sign Out
					        </a>
					        </div>
					        </li>
					</ul>
				    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
				    <span className="mdi mdi-menu" />
				    </button>
				</div>
			</nav>
		);
	}
}
/**
 * Export Section
 */
export default withRouter(Topbar);