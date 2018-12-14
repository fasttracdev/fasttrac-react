/**
 * import section
 */
import React, { Component } from 'react';
import { getUserDataFromLocalStorage } from '../../../services/helper';
import '../style.css';
import Sidebar from '../sidebar';
import Topbar from '../topbar';
import { httpGet } from '../../../services/https';
import Loader from '../../../Loader/loader'

/**
 * Class declaration
 */
class DashBoard extends Component {
	
	user = {};

  /* Constructor */
	constructor(props) {
	  super(props);
		this.user = getUserDataFromLocalStorage();
	}
	
	componentDidMount() {
		this.getDashboardContent();
	}

	/**
	 * state
	 */
	state = {
		driver_count: 0,
		isRequesting: false
	}

	/**
   * Get Drivers List
   */
	getDashboardContent() {
		this.setState({
			isRequesting: true
		})
		let url = '/dashboard/driver-count' 
		httpGet(url).then((success) => {
			if (success.data.length > 0) {
				this.setState({
					isRequesting: false,
					driver_count: success.data[0].driver_count
				})
				return
			} 
		}, (err) => {
			this.setState({
				isRequesting: false
			})
		});
	}
	/**
	 * Go to Driver listing page
	 */
	goToDriversListings() {
		this.props.history.push('/admin/drivers');
	}

	/**
	 * Render Html 
	 */
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
					{
						this.state.isRequesting ?
							<Loader isLoader={this.state.isRequesting} /> : 
					<div className="main-panel">
						<div className="content-wrapper">
							<div className="row">						       
										<div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card dashboard-card" onClick={() => this.goToDriversListings()}>
						          <div className="card card-statistics">
						            <div className="card-body">
						              <div className="clearfix">
						                <div className="float-left">
						                  <i className="mdi mdi-account-location text-info icon-lg" />
						                </div>
														<div className="float-right">
						                  <p className="mb-0 text-right">Drivers</p>
						                  <div className="fluid-container">
						                    <h3 className="font-weight-medium text-right mb-0">{this.state.driver_count}</h3>
						                  </div>
						                </div>
						              </div>
						             </div>
						          </div>
						        </div>
						     </div>
						</div>
						{/* footer */}
						<footer className="footer">
							<div className="container-fluid clearfix">
								<span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2018
									{/* <a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved. */}
								</span>
									{/* <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Hand-crafted &amp; made with */}
									{/* <i className="mdi mdi-heart text-danger" /> */}
								{/* </span> */}
							</div>
						</footer>
					</div>}
				</div>
			</div>
		);
	}
}
export default DashBoard;