/**
 * Import Section
 */
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPost } from '../../../services/https';
import { getUserDataFromLocalStorage, formatPhone, handleValidation} from '../../../services/helper';
import '../style.css';
import SearchDriver from './search-driver'
import Sidebar from '../sidebar';
import Topbar from '../topbar';
import Loader from '../../../Loader/loader'
import MESSAGES from '../../../services/messages';

/**
 * Calss delaration
 */
class AdminAddDriver extends Component {

	/**
	 * Constructor
	 * @param {*} props 
	 */
	constructor(props) {
		super(props);
		this.user = getUserDataFromLocalStorage();
	}

	/**
	 * State
	 */
	state = {
		fields: {},
		errors: {},
		isRequesting: false,
		isDataSearched: false
	}

	/**
	 * Add Drivers
	 */
	addDriver() {
		this.setState({
			isRequesting: true
		});
		this.splitName(this.state.fields.name)
		setTimeout(()=>{
			var data = {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.fields.email,
				role: 'driver',
				driver_id: this.state.fields.driver_id,
				address: this.state.fields.address,
				city: this.state.fields.city,
				phone: this.state.fields.phone
			}
			httpPost('/user/create', data).then((success)=> {
				this.props.enqueueSnackbar(MESSAGES.DRIVER_ADDED, {
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right',
					},
					variant: 'success',
					autoHideDuration: 3000
				});
				this.props.history.push('/admin/drivers');
			}, (err) => {
				this.handleErrorMessage(err);
			
			});
		},200)
	}	

	/**
	 * Split Name
	 */
	splitName(n) {
		var name = n.split(' ');
		var ln =  [];
		if(name && name.length > 1) {
			name.forEach(val => {
				if (name[0] !== val) {
					ln.push(val);
				}
			});
		}
		var last_name = ln.join(', ')
		this.setState({
			first_name: name[0],
			last_name: last_name.replace(/,/g, ' ')
		})
	}

	/**
	 * Save Data
	 * @param {*} e 
	 */
	saveData(e) {
		var action = 'add';
		e.preventDefault();
		var data = handleValidation(this.state.fields, action);
		if (data.isValid) {
			this.addDriver();
		} else {
			this.setState({
				errors: data.err
			})
		}
	}

	/**
	 * Get driver data click
	 */
	getDriverDataOnSearch(driver) {
		this.setState({
			fields: {
				name: driver.reference_name,
				driver_id: driver.fasttrac_driver_num,
				email: driver.email,
				address: driver.address_1,
				city: driver.city,
				phone: formatPhone(driver.phone)
			},
			isDataSearched: true
		})
	}

	/**
	 * handle error message
	 */
	handleErrorMessage(err) {
		if(Array.isArray(err.errors)) {
			var error = err.errors[0].msg ? err.errors[0].msg : err.errors[0].message
			this.props.enqueueSnackbar(error, {
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (!Array.isArray(err.errors) && err.errors && err.errors.message) {
			this.props.enqueueSnackbar(err.errors.message, {
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (!Array.isArray(err.errors) && err.errors && !err.errors.message) {
			this.props.enqueueSnackbar(err.errors, {
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right',
				},
				variant: 'error',
				autoHideDuration: 3000
			});
		}		
		this.setState({
			isRequesting: false
		});
	}

	/**
	 *  Cancel Button
	 */
	cancel() {
		this.props.history.push('/admin/drivers');
	}

	/**
	 * Handled Input data
	 * @param {*} e 
	 * @param {*} field 
	 */
	handleChange(e, field) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({ fields });
	}

	/**
	 * Render HTML
	 */
	render() {
		const { user } = this.user;
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
					{
						this.state.isRequesting ? 
						<Loader isLoader={this.state.isRequesting} /> : 
							<div className="main-panel">
								<div className="content-wrapper">
									<div className="row justify-content-center">
										<div className="col-lg-6 grid-margin stretch-card">
													<div className="card">
														<div className="card-body">
													<h2 className="card-title add-driver-title">Add Driver</h2>
													<div className="text-left driver-form-wrapper">
														<SearchDriver setData={data => this.getDriverDataOnSearch(data)} />
														<form className="forms-sample">																
															<div className="form-group">
																<label htmlFor="exampleInputName1">Driver Number</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "driver_id")} value={this.state.fields.driver_id ? this.state.fields.driver_id : ''}
																	placeholder="Driver Id"
																	disabled
																/>
															</div>
															<div className="form-group">
																<label htmlFor="exampleInputName1">Name</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "name")} value={this.state.fields.name ? this.state.fields.name : ''}
																	placeholder="Name"
																/>
																<div className="form-error">{this.state.errors["name"]}</div>
															</div>
															<div className="form-group">
																<label htmlFor="exampleInputName1">Address</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "address")} value={this.state.fields.address ? this.state.fields.address : ''}
																	placeholder="Address"
																/>
																<div className="form-error">{this.state.errors["address"]}</div>
															</div>
															<div className="form-group">
																<label htmlFor="exampleInputName1">City</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "city")} value={this.state.fields.city ? this.state.fields.city : ''}
																	placeholder="City"
																/>
																<div className="form-error">{this.state.errors["city"]}</div>
															</div>
															<div className="form-group">
																<label htmlFor="exampleInputName1">Phone</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "phone")} value={this.state.fields.phone ? formatPhone(this.state.fields.phone) : ''}
																	placeholder="Phone"
																/>
																<div className="form-error">{this.state.errors["phone"]}</div>
															</div>
															<div className="form-group">
																<label htmlFor="exampleInputName1">Email</label>
																<input
																	type="text"
																	className="form-control"
																	onChange={(e) => this.handleChange(e, "email")} value={this.state.fields.email ? this.state.fields.email : ''}
																	placeholder="Email"
																/>
																<div className="form-error">{this.state.errors["email"]}</div>
															</div>
															<div className="text-center">
																<button type="button" onClick={() => this.cancel()} className="btn btn-basic mr-2">
																	<span>Cancel</span>
																</button>
																<button type="button" onClick={(e) => this.saveData(e)} className="btn btn-success mr-2" disabled={!this.state.isDataSearched}>Save</button>
															</div>
																</form>
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
									</div>
								</footer>
							</div>}
					</div>
				</div>
			);
	}
}
/**
 * Export Section
 */
export default withSnackbar(withRouter(AdminAddDriver));