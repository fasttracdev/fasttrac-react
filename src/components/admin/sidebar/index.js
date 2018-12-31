import React, { Component } from 'react';
import { withRouter } from "react-router";

class Sidebar extends Component {

    /* Constructor */
	constructor(props) {
	    super(props);
	}

	gotoRoute(route) {
		var { user } = this.props;
		if (user.user_metadata.role === 'admin') {
			this.props.history.push(route);
		}
		return;
	}

	render() {
		const { user, location } = this.props;
		return (
			<nav className="sidebar sidebar-offcanvas" id="sidebar">
				<ul className="nav">
					<li className="nav-item nav-profile sidebar-link" onClick={() => { this.gotoRoute('/admin/dashboard') }}>
						<div className="nav-link">
							<div className="user-wrapper">
								<div className="profile-image">
									<img src={user.picture} alt="profile image" />
								</div>
								<div className="text-wrapper">
									<p className="profile-name">{user.user_metadata.first_name + ' ' + user.user_metadata.last_name}</p>
									<div>
										<small className="designation text-muted">{user.user_metadata.role}</small>
										<span className="status-indicator online" />
									</div>
									<div className="mt-2">
										{user.user_metadata.role !== 'admin' ?
											<small className="designation text-muted">{'Id: ' + user.user_metadata.driver_id}</small> : null}
									</div>
								</div>
							</div>
						</div>
					</li>
					{
						user.user_metadata.role === 'admin' ?
						<li className={(location.pathname === '/admin/dashboard') ? 'nav-item active sidebar-link' : 'nav-item sidebar-link' }>
							<a className="nav-link" onClick={() => {this.gotoRoute('/admin/dashboard')}} >
								<i className="menu-icon mdi mdi-television" />
								<span className="menu-title">Dashboard</span>
							</a>
						</li>:null}
						{
						user.user_metadata.role === 'admin' ?
						<li className={(location.pathname === '/admin/drivers') ? 'nav-item active sidebar-link' : 'nav-item sidebar-link' }>
							<a className="nav-link" onClick={() => {this.gotoRoute('/admin/drivers')}} >
								<i className="menu-icon mdi mdi-ship-wheel" />
								<span className="menu-title">Drivers</span>
							</a>
						</li>:null}
					{user.user_metadata.role === 'admin' ?
						<li className={(location.pathname === '/admin/drivers-report') ? 'nav-item active sidebar-link' : 'nav-item sidebar-link'}>
							<a className="nav-link" onClick={() => { this.gotoRoute('/admin/drivers-report') }} >
								<i className="menu-icon mdi mdi-note" />
								<span className="menu-title">Drivers Reports</span>
							</a>
						</li> : null
					}
					{
						user.user_metadata.role === 'admin' ?
							<li className={(location.pathname === '/admin/settlement-reports') ? 'nav-item active sidebar-link' : 'nav-item sidebar-link'}>
								<a className="nav-link" onClick={() => { this.gotoRoute('/admin/settlement-reports') }} >
									<i className="menu-icon mdi mdi-note" />
									<span className="menu-title">Sattlement Report</span>
								</a>
							</li> : null}
				</ul>
			</nav>
		);
	}
}

export default withRouter(Sidebar);