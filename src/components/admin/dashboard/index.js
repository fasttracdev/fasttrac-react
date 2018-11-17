import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { getUserDataFromLocalStorage } from '../../../services/helper';
import '../style.css';

// Components
import Sidebar from '../sidebar';
import Topbar from '../topbar';

class DashBoard extends Component {

	user = {};

    /* Constructor */
	constructor(props) {
	    super(props);
	    this.user = getUserDataFromLocalStorage();
	}

	render() {
		const { user } = this.user;
		return (
			<div className="container-scroller">
				{/* partial:partials/_navbar.html */}
				<Topbar user={user} />

				{/* partial */}
				<div className="container-fluid page-body-wrapper">
					{/* partial:partials/_sidebar.html */}
					<Sidebar user={user} />

					<div className="main-panel">
						<div className="content-wrapper">
							<div className="row">
						        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
						          <div className="card card-statistics">
						            <div className="card-body">
						              <div className="clearfix">
						                <div className="float-left">
						                  <i className="mdi mdi-cube text-danger icon-lg" />
						                </div>
						                <div className="float-right">
						                  <p className="mb-0 text-right">Total Revenue</p>
						                  <div className="fluid-container">
						                    <h3 className="font-weight-medium text-right mb-0">$65,650</h3>
						                  </div>
						                </div>
						              </div>
						              <p className="text-muted mt-3 mb-0">
						                <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true" /> 65% lower growth
						              </p>
						            </div>
						          </div>
						        </div>
						        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
						          <div className="card card-statistics">
						            <div className="card-body">
						              <div className="clearfix">
						                <div className="float-left">
						                  <i className="mdi mdi-receipt text-warning icon-lg" />
						                </div>
						                <div className="float-right">
						                  <p className="mb-0 text-right">Orders</p>
						                  <div className="fluid-container">
						                    <h3 className="font-weight-medium text-right mb-0">3455</h3>
						                  </div>
						                </div>
						              </div>
						              <p className="text-muted mt-3 mb-0">
						                <i className="mdi mdi-bookmark-outline mr-1" aria-hidden="true" /> Product-wise sales
						              </p>
						            </div>
						          </div>
						        </div>
						        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
						          <div className="card card-statistics">
						            <div className="card-body">
						              <div className="clearfix">
						                <div className="float-left">
						                  <i className="mdi mdi-poll-box text-success icon-lg" />
						                </div>
						                <div className="float-right">
						                  <p className="mb-0 text-right">Sales</p>
						                  <div className="fluid-container">
						                    <h3 className="font-weight-medium text-right mb-0">5693</h3>
						                  </div>
						                </div>
						              </div>
						              <p className="text-muted mt-3 mb-0">
						                <i className="mdi mdi-calendar mr-1" aria-hidden="true" /> Weekly Sales
						              </p>
						            </div>
						          </div>
						        </div>
						        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
						          <div className="card card-statistics">
						            <div className="card-body">
						              <div className="clearfix">
						                <div className="float-left">
						                  <i className="mdi mdi-account-location text-info icon-lg" />
						                </div>
						                <div className="float-right">
						                  <p className="mb-0 text-right">Employees</p>
						                  <div className="fluid-container">
						                    <h3 className="font-weight-medium text-right mb-0">246</h3>
						                  </div>
						                </div>
						              </div>
						              <p className="text-muted mt-3 mb-0">
						                <i className="mdi mdi-reload mr-1" aria-hidden="true" /> Product-wise sales
						              </p>
						            </div>
						          </div>
						        </div>
						     </div>
						</div>

						{/* footer */}
						<footer className="footer">
							<div className="container-fluid clearfix">
								<span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2018
									<a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved.</span>
									<span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted &amp; made with
									<i className="mdi mdi-heart text-danger" />
								</span>
							</div>
						</footer>
					</div>
				</div>
			</div>
		);
	}
}

export default DashBoard;