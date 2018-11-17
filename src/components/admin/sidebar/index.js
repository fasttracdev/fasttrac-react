import React, { Component } from 'react';
import { withRouter } from "react-router";
import { getUserDataFromLocalStorage } from '../../../services/helper';

class Sidebar extends Component {

    /* Constructor */
	constructor(props) {
	    super(props);
	}

	gotoRoute(route) {
		this.props.history.push(route);
	}

	render() {
		const { user, location } = this.props;
		return (
			<nav className="sidebar sidebar-offcanvas" id="sidebar">
				<ul className="nav">
					<li className="nav-item nav-profile">
						<div className="nav-link">
							<div className="user-wrapper">
								<div className="profile-image">
									<img src={user.picture} alt="profile image" />
								</div>
								<div className="text-wrapper">
									<p className="profile-name">{user.user_metadata.first_name + ' ' + user.user_metadata.last_name}</p>
									<div>
										<small className="designation text-muted">Manager</small>
										<span className="status-indicator online" />
									</div>
								</div>
							</div>
						</div>
					</li>
					<li className={(location.pathname === '/admin/dashboard') ? 'nav-item active' : 'nav-item' }>
						<a className="nav-link" onClick={() => {this.gotoRoute('/admin/dashboard')}} >
							<i className="menu-icon mdi mdi-television" />
							<span className="menu-title">Dashboard</span>
						</a>
					</li>
					<li className={(location.pathname === '/admin/drivers') ? 'nav-item active' : 'nav-item' }>
						<a className="nav-link" onClick={() => {this.gotoRoute('/admin/drivers')}} >
							<i className="menu-icon mdi mdi-ship-wheel" />
							<span className="menu-title">Drivers</span>
						</a>
					</li>
				</ul>
			</nav>
		);
	}
}

export default withRouter(Sidebar);