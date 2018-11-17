import React, { Component } from 'react';
import { getUserDataFromLocalStorage } from '../../../services/helper';
import Auth from '../../../services/auth';
const auth = new Auth();

class Topbar extends Component {

	isActiveDropDown = false;

    /* Constructor */
	constructor(props) {
	    super(props);
	}

	openCloseDropDown() {
		this.isActiveDropDown = !this.isActiveDropDown;
	}

	signOut() {
		auth.logout();
	}

	render() {
		const { user } = this.props;
		return (
			<nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
			    <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
			        <a className="navbar-brand brand-logo" href="index.html">
			        <img src="../../src/images/logo.png" alt="logo" />
			        </a>
			        <a className="navbar-brand brand-logo-mini" href="index.html">
			        <img src="../../src/images/logo.png" alt="logo" />
			        </a>
			    </div>
			    <div className="navbar-menu-wrapper d-flex align-items-center">
				    <ul className="navbar-nav navbar-nav-left header-links d-none d-md-flex">
				        <li className="nav-item">
				            <a href="#" className="nav-link">Schedule
				            <span className="badge badge-primary ml-1">New</span>
				            </a>
				        </li>
				        <li className="nav-item active">
				            <a href="#" className="nav-link">
				            <i className="mdi mdi-elevation-rise" />Reports</a>
				        </li>
				        <li className="nav-item">
				            <a href="#" className="nav-link">
				            <i className="mdi mdi-bookmark-plus-outline" />Score</a>
				        </li>
				    </ul>
				    <ul className="navbar-nav navbar-nav-right">
				        <li className="nav-item dropdown">
				            <a className="nav-link count-indicator dropdown-toggle" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
				            <i className="mdi mdi-file-document-box" />
				            <span className="count">7</span>
				            </a>
				            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
				            <div className="dropdown-item">
				                <p className="mb-0 font-weight-normal float-left">You have 7 unread mails
				                </p>
				                <span className="badge badge-info badge-pill float-right">View all</span>
				            </div>
				            <div className="dropdown-divider" />
				            <a className="dropdown-item preview-item">
				                <div className="preview-thumbnail">
				                    <img src="images/faces/face4.jpg" alt="image" className="profile-pic" />
				                </div>
				                <div className="preview-item-content flex-grow">
				                    <h6 className="preview-subject ellipsis font-weight-medium text-dark">David Grey
				                        <span className="float-right font-weight-light small-text">1 Minutes ago</span>
				                    </h6>
				                    <p className="font-weight-light small-text">
				                        The meeting is cancelled
				                    </p>
				                </div>
				            </a>
				            <div className="dropdown-divider" />
				            <a className="dropdown-item preview-item">
				                <div className="preview-thumbnail">
				                    <img src="images/faces/face2.jpg" alt="image" className="profile-pic" />
				                </div>
				                <div className="preview-item-content flex-grow">
				                    <h6 className="preview-subject ellipsis font-weight-medium text-dark">Tim Cook
				                        <span className="float-right font-weight-light small-text">15 Minutes ago</span>
				                    </h6>
				                    <p className="font-weight-light small-text">
				                        New product launch
				                    </p>
				                </div>
				            </a>
				            <div className="dropdown-divider" />
				                <a className="dropdown-item preview-item">
				                    <div className="preview-thumbnail">
				                        <img src="images/faces/face3.jpg" alt="image" className="profile-pic" />
				                    </div>
				                    <div className="preview-item-content flex-grow">
				                        <h6 className="preview-subject ellipsis font-weight-medium text-dark"> Johnson
				                            <span className="float-right font-weight-light small-text">18 Minutes ago</span>
				                        </h6>
				                        <p className="font-weight-light small-text">
				                            Upcoming board meeting
				                        </p>
				                    </div>
				                </a>
				            </div>
				        </li>
				        <li className="nav-item dropdown">
				            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
				            <i className="mdi mdi-bell" />
				            <span className="count">4</span>
				            </a>
				            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
				            <a className="dropdown-item">
				                <p className="mb-0 font-weight-normal float-left">You have 4 new notifications
				                </p>
				                <span className="badge badge-pill badge-warning float-right">View all</span>
				            </a>
				            <div className="dropdown-divider" />
				            <a className="dropdown-item preview-item">
				                <div className="preview-thumbnail">
				                    <div className="preview-icon bg-success">
				                        <i className="mdi mdi-alert-circle-outline mx-0" />
				                    </div>
				                </div>
				                <div className="preview-item-content">
				                    <h6 className="preview-subject font-weight-medium text-dark">Application Error</h6>
				                    <p className="font-weight-light small-text">
				                        Just now
				                    </p>
				                </div>
				            </a>
				            <div className="dropdown-divider" />
				                <a className="dropdown-item preview-item">
				                    <div className="preview-thumbnail">
				                        <div className="preview-icon bg-warning">
				                            <i className="mdi mdi-comment-text-outline mx-0" />
				                        </div>
				                    </div>
				                    <div className="preview-item-content">
				                        <h6 className="preview-subject font-weight-medium text-dark">Settings</h6>
				                        <p className="font-weight-light small-text">
				                            Private message
				                        </p>
				                    </div>
				                </a>
				                <div className="dropdown-divider" />
				                    <a className="dropdown-item preview-item">
				                        <div className="preview-thumbnail">
				                            <div className="preview-icon bg-info">
				                                <i className="mdi mdi-email-outline mx-0" />
				                            </div>
				                        </div>
				                        <div className="preview-item-content">
				                            <h6 className="preview-subject font-weight-medium text-dark">New user registration</h6>
				                            <p className="font-weight-light small-text">
				                                2 days ago
				                            </p>
				                        </div>
				                    </a>
				                </div>
				        </li>
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

export default Topbar;