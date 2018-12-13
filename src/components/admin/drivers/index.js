/**
 * import Section
 */
import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Table from 'rc-table';
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router";
import { httpGet, httpDelete } from '../../../services/https';
import { getUserDataFromLocalStorage, convertFormattedDate } from '../../../services/helper';
import MESSAGES from '../../../services/messages';
import '../style.css';
import Sidebar from '../sidebar';
import Topbar from '../topbar';
import Loader from '../../../Loader/loader'
import ReactPaginate from 'react-paginate'
import ENV from '../../../environment/env'
/**
 * Class Declaration
 */
class AdminDrivers extends Component {
	_env = new ENV();
	user = {};
	/**
	 * state
	 */
	state = {
		drivers: [],
		isRequesting: false,
		total_pages: 0,
		page: 1,
		limit:10,
		order_dir: 'desc',
		order_field: 'id',
		is_filter: false,
		driver_name: '',
		driver_id: '',
		email: ''
	};

	/**
	 * Column
	 */
	columns = [
		{ title: 'Avatar', dataIndex: 'picture', key:'picture', width: 20, render: (val)=> <img src={val} /> },
		{
			title:<div onClick={() => { this.sortList('first_name') }}>
							<span>Name </span> <i className="mdi mdi-sort header-icon"></i>
						</div>, 
			dataIndex: 'name', key: 'name', width: 1000 }, 
		{ 	title: <div onClick={() => { this.sortList('driver_id') }}>
							<span>Driver Id </span> <i className="mdi mdi-sort header-icon"></i>
						</div>, dataIndex: 'driver_id', key:'driver_id', width: 800 }, 
		{
			title: <div onClick={() => { this.sortList('email') }}>
				<span>Email </span> <i className="mdi mdi-sort header-icon"></i>
			</div>, dataIndex: 'email', key:'email', width: 1000 },
		{ title: 'Account Status', dataIndex: 'email_verified', key:'email_verified', width: 1000, render: (val)=> <div>{(val) ? 'Verified' : 'Not Verified'}</div> },
		{ title: 'Actions', dataIndex: 'user_id', key:'operations', 
			render: (val) => <div><button type="button" title="Edit" onClick={()=> { this.editDriver(val) }} className="btn margin-right10 btn-icons btn-rounded btn-inverse-outline-primary"><i className="mdi mdi-account-edit"></i></button><button title="Delete" type="button" onClick={() => {this.openDeletePopUp(val)}} className="btn btn-icons btn-rounded btn-inverse-outline-primary"><i className="mdi mdi-delete"></i></button></div>
		}
	];

	

	/**
	 * When Component Did Mount
	 */
	componentDidMount() {
		this.getDrivers();
	}

	/**
	 * sortList
	 */
	sortList(val) {
		this.setState ({
			order_dir: this.state.order_dir === 'desc'? 'asc' : 'desc',
			order_field: val,
		}, () => this.getDrivers())
	}

	/**
	 * get Drivers
	 */
	getDrivers() {
		this.setState({
			isRequesting: true
		})
		var url = '/user/drivers?';
		var params = this.getFilterParams();
		httpGet(url, params).then((success) => {
			success.data.forEach(function (element, key) {
				element.created_at = convertFormattedDate(element.created_at);
				element.key = key;
				element.name = element.user_metadata.first_name + ' ' + element.user_metadata.last_name;
				element.driver_id = element.user_metadata.driver_id ? element.user_metadata.driver_id : 0;
			});
			this.setState({
				drivers: success.data,
				total_pages: success.meta.pagination.total_pages,
				isRequesting: false
			});
		}, (err) => {
			this.handleErrorMessage(err);
		});
	}

    /* Constructor */
	constructor(props) {
	  super(props);
	  this.user = getUserDataFromLocalStorage();
	}

	openDeletePopUp(id) {
		Swal({
		  	title: 'Are you sure?',
		  	text: 'You will not be able to recover this driver anymore!',
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: 'Yes, delete it!',
		  	cancelButtonText: 'No, keep it'
		}).then((result) => {
			if (result.value) {
				this.setState({
					isRequesting: true
				})
				httpDelete('/user/delete/' + id).then((res)=> {
					for (var i=0; i < this.state.drivers.length; i++) {
						if(this.state.drivers[i].user_id === id) {
							this.state.drivers.splice(i, 1);
							break;
						};
					};

					if(res.data.length <= 0) {
						this.setState({
							page: Number(this.state.page) - 1
						})
					}

					this.setState({
						drivers: this.state.drivers,
						isRequesting: false
					}, () => {
						this.getDrivers()
					});
					this.props.enqueueSnackbar(MESSAGES.DRIVER_DELETED, {					
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right',
						},
						variant: 'success',
						autoHideDuration: 10000
					});
				}, (err) => {
					this.handleErrorMessage(err);
				});
			}
		});
	}

	editDriver(id) {
		this.props.history.push('/admin/drivers/edit/' + id);
	}

	gotoRoute(route) {
		this.props.history.push(route);
	}


	/**
	 * handle error message
	 */
	handleErrorMessage(err) {
		if (err.errors && err.errors.message) {
			this.props.enqueueSnackbar(err.errors.message, {
					ancorOrigin: {
							vertical: 'top',
							horizontal: 'right',
						},
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (err.errors && !err.errors.message) {
			this.props.enqueueSnackbar(err.errors, {
					ancorOrigin: {
							vertical: 'top',
							horizontal: 'right',
						},
				variant: 'error',
				autoHideDuration: 3000
			});
		}	
		this.setState({
			isRequesting: false
		})
	}

	/**
   * handle pagination
   * @param  p
   */
	handlePagination(p) {
		var page = p.selected + 1
		if (page === this.state.page) return
		this.setState({ page: page }, () => {
			this.getDrivers()
		})
	}
	
	/**
	 * make Query string
	 */
	encodeQueryData (data) {
		const ret = [];
		for (let d in data)
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
		return ret.join('&');
	}

	/**
   * Export Report
   */
	exportReport() {
		const querystring = this.encodeQueryData(this.getFilterParams());
		var url = this._env.getENV().API_BASE_URL + '/user/download-drivers?'
		url += 'token=Bearer ' + getUserDataFromLocalStorage().token
		url += '&' + querystring
		window.open(url);
	}

	/**
	* Toggle agent filter
	*/
	toggleFilter() {
		this.setState({
			is_filter: !this.state.is_filter,
		})
	}

	/**
   * Apply Filter and seting params
   */
	getFilterParams(key) {
		let params = {}

		params['order_dir'] = this.state.order_dir
		params['order_field'] = this.state.order_field

		if (this.state.page) {
			params['page'] = this.state.page
		}

		if (this.state.limit) {
			params['limit'] = this.state.limit
		}

		if (this.state.driver_name) {
			params['driver_name'] = this.state.driver_name
		}
		if (this.state.driver_id) {
			params['driver_id'] = this.state.driver_id
		}
		if (this.state.email) {
			params['email'] = this.state.email
		}
		
		return params
	}

	reset() {
		this.setState({
			email: '',
			driver_id: '',
			driver_name: ''
		},() => this.getDrivers())
	}

	render() {
		const { user } = this.user;
		const { drivers } = this.state;
		return (
			<div className="container-scroller">
				<div>

				</div>
				{/* partial:partials/_navbar.html */}
				<Topbar user={user} />

				{/* partial */}
				<div className="container-fluid page-body-wrapper">
					{/* partial:partials/_sidebar.html */}
					<Sidebar user={user} />
					{this.state.isRequesting ?
						<Loader isLoader={this.state.isRequesting} /> :
					<div className="main-panel">
						<div className="content-wrapper">							
							<div className="grid-margin stretch-card">
								<div className="advanced-filters-wrap">
									<div className="table-btns">
										<button
											onClick={() => this.toggleFilter()}
												className="btn btn-primary"
										>
											Advanced Filter <i className="mdi mdi-arrow-down" />
										</button>
									</div>
								</div>								
							</div>
							{
								this.state.is_filter ?
								<div className="filter-inner-content">
										<div className="grid-margin stretch-card form-group">
										<label htmlFor="exampleInputID">Driver Name</label>
										<input
											className="form-control"
											id="drivername"
											name="drivername"
											placeholder="Driver Name"
											type="text"
											onChange={(e) => this.setState({
												driver_name: e.target.value
											})}
											value={this.state.driver_name}
											autoComplete="Off"
										/>
									</div>
										<div className="grid-margin stretch-card form-group">
											<label htmlFor="exampleInputID">Driver Id</label>
											<input
											className="form-control"
											id="driverid"
											name="driverid"
											placeholder="Driver Id"
											type="number"
											onChange={(e) => this.setState({
												driver_id: e.target.value
											})}
											value={this.state.driver_id}
											autoComplete="Off"
										/>
									</div>
										<div className="grid-margin stretch-card form-group">
											<label htmlFor="exampleInputID">Email</label>
											<input
											className="form-control"
											id="email"
											name="email"
											placeholder="Email"
											type="text"
											onChange={(e) => this.setState({
												email: e.target.value
											})}
											value={this.state.email}
											autoComplete="Off"
										/>
									</div>
									<button type="button" onClick={() => this.reset()} className="btn btn-primary apply-btn">Reset</button>
									<button type="button" onClick={() => this.getDrivers()} className="btn btn-success apply-btn">Apply</button>
								</div> : null
							}
							<div className="row">
 								<div className="col-lg-12 grid-margin stretch-card">
							        <div className="card">
								        <div className="card-body">
													<h2 className="card-title">
														<span>Drivers Listing</span>														
													</h2>

								            <button type="button" className="btn btn-primary btn-fw add-driver-btn" onClick={()=> {this.gotoRoute('/admin/drivers/add')}}>
															<i className="mdi mdi-account-plus"></i>Add Driver
														</button>
														<button type="button" onClick={() => this.exportReport()} className="btn btn-success btn-fw add-driver-btn download-driver" disabled={this.state.drivers.length <= 0}>Export</button>
								            <div className="table-responsive">
								            	{
								            		drivers &&
								            		<Table columns={this.columns} className="table table-bordered" data={this.state.drivers} />
								            	}
								            </div>
														{
															this.state.drivers.length > 0 ?
														<div className="pagination-wrapper mt-3 mb-3 ml-3">
															<ReactPaginate previousLabel={"<"}
																nextLabel={">"}
																breakClassName={"break-me"}
																pageCount={this.state.total_pages}
																marginPagesDisplayed={2}
																pageRangeDisplayed={1}
																breakLabel={". . ."}
																onPageChange={e => this.handlePagination(e)}
																containerClassName={"pagination"}
																activeClassName={'active'}
																subContainerClassName={"pages pagination"}
																initialPage={this.state.page - 1}
															/>
														</div> : null
														}
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
							</div>
						</footer>
					</div>}
				</div>
			</div>
		);
	}
}

export default withSnackbar(withRouter(AdminDrivers));