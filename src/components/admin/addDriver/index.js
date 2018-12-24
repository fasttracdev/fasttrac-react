/**
 * Import Section
 */
import React, { Component } from 'react';
import validator from 'validator';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPost } from '../../../services/https';
import { getUserDataFromLocalStorage } from '../../../services/helper';
import '../style.css';
import SearchDriver from './search-driver'
import PhoneNumberFormat from '../../../pipes/phone-formate'
import Sidebar from '../sidebar';
import Topbar from '../topbar';
import Loader from '../../../Loader/loader'
import MESSAGES from '../../../services/messages';

/**
 * Calss delaration
 */
class AdminAddDriver extends Component {

	/**
	 * Instance
	 */
	_phoneFormat = new PhoneNumberFormat()

	/**
	 * state
	 */
	state = {
		isSubmitAddDriver: false,
		firstName: '',
		name: '',
		email: '',
		address: '',
		driver_id: 0,
		city: '',
		phone: '',
		isRequesting: false,
		error: {
			isNameRequired: false,
			isEmailRequired: false,
			isValidEmail: false
		}
	};

	componentDidMount() {}

  /* Constructor */
	constructor(props) {
	    super(props);
	    this.user = getUserDataFromLocalStorage();
	}

	/**
	 * Add Drivers
	 */
	addDriver() {
		if(this.state.isSubmitAddDriver) {
			return;
		}
		this.setState({
			isSubmitAddDriver: true,
			isRequesting: true
		});
		var checkFormValidation = this.checkAddDriverValidation();
		if(checkFormValidation) {
			this.splitName(this.state.name)
			setTimeout(()=>{
				var data = {
					first_name: this.state.firstName,
					last_name: this.state.lastName,
					email: this.state.email,
					role: 'driver',
					driver_id: this.state.driver_id,
					address: this.state.address,
					city: this.state.city,
					phone: this.state.phone
				}
				httpPost('/user/create', data).then((success)=> {
					this.setState({
						isSubmitAddDriver: false
					});
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
					this.setState({
						isSubmitAddDriver: false,
					});
				});
			},200)
		}else {
			this.setState({
				isSubmitAddDriver: false,
				isRequesting: false
			});
		}
	}

	/**
	 * Validation
	 */
	checkAddDriverValidation() {
		if(this.state.name === '' || this.state.name === null || this.state.name.length < 1) {
			this.setState({
				error: {
					isNameRequired: true,
					isEmailRequired: false,
					isValidEmail: false
				}
			})
			return false;
		}

		if(this.state.email === '' || this.state.email === null || this.state.email.length < 1) {
			this.setState({
				error: {
					isNameRequired: false,
					isLastNameRequired: false,
					isEmailRequired: true,
					isValidEmail: false
				}
			})
			return false;
		}

		if(!validator.isEmail(this.state.email)) {
			this.setState({
				error: {
					isNameRequired: false,
					isEmailRequired: false,
					isValidEmail: true
				}
			})
			return false;
		}

		this.setState({
			error: {
				isNameRequired: false,
				isEmailRequired: false,
				isValidEmail: false
			}
		})

		return true;
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
			firstName: name[0],
			lastName: last_name.replace(/,/g, ' ')
		})
	}

	/**
	 * Get driver data click
	 */
	getDriverDataOnSearch(driver) {
		this.setState({
			name: driver.reference_name,
			driver_id: driver.fasttrac_driver_num,
			email: driver.email,
			address: driver.address_1,
			city: driver.city,
			phone: this.formatPhone(driver.phone)
		})
	}

	/**
   * Format Cell Phone
   *
   * @param {String} phone
   *
   * @return {String}
   */
	formatPhone(phone) {
		phone = String(phone)
		var v = phone.replace(/[^\d]/g, '')
		v = v.substring(0, 10)
		var f = ''

		switch (v.length) {
			case 4:
			case 5:
			case 6:
				f = v.replace(/(\d{3})/, '($1) ')
				break

			case 7:
			case 8:
			case 9:
				f = v.replace(/(\d{3})(\d{3})/, '($1) $2-')
				break

			default:
				f = v.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
		}
		return f
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
	 * Render HTML
	 */
	render() {
		const { user } = this.user;
		const { isSubmitAddDriver } = this.state;
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
																		<label htmlFor="exampleInputID">Driver Number</label>
																		<input
																			type="text"
																			className="form-control"
																			onChange={e =>
																				this.setState({
																					driver_id: e.target.value
																				})
																			}
																			value={
																				this.state.driver_id
																					? this.state.driver_id
																					: ''
																			}
																			placeholder="Driver Number" disabled />															
																	</div>
																	<div className="form-group">
																			<label htmlFor="exampleInputName1">Name</label>
																			<input 
																				type="text" 
																				className="form-control" 
																				onChange={e =>
																					this.setState({
																						name: e.target.value
																					})
																				}
																				value={
																					this.state.name
																						? this.state.name
																						: ''
																				}
																				placeholder="Name" />
																			{
																				this.state.error.isNameRequired &&
																				<div className="form-error">Name is required</div>
																			}
																	</div>
																	
																	<div className="form-group">
																		<label htmlFor="exampleInputAddress">Address</label>
																		<input
																			type="text"
																			className="form-control"
																			onChange={e =>
																				this.setState({
																					address: e.target.value
																				})
																			}
																			value={
																				this.state.address
																					? this.state.address
																					: ''
																			}
																			placeholder="Address" />
																	</div>

																	<div className="form-group">
																		<label htmlFor="exampleInputAddress">City</label>
																		<input
																			type="text"
																			className="form-control"
																			onChange={e =>
																				this.setState({
																					city: e.target.value
																				})
																			}
																			value={
																				this.state.city
																					? this.state.city
																					: ''
																			}
																			placeholder="City" />
																	</div>

																	<div className="form-group">
																		<label htmlFor="exampleInputAddress">Phone</label>
																		<input
																			type="text"
																			className="form-control"
																			onChange={e =>
																				this.setState({
																					phone: e.target.value
																				})
																			}
																			value={																		
																				this.state.phone
																					?this.formatPhone(this.state.phone)
																					: ''
																			}
																			placeholder="Phone" />
																	</div>

																	<div className="form-group">
																			<label htmlFor="exampleInputEmail3">Email address</label>
																			<input 
																				type="email" 
																				className="form-control" 
																				onChange={e =>
																					this.setState({
																						email: e.target.value
																					})
																				}
																				id="exampleInputEmail3" 
																				placeholder="Email" 
																				value={
																					this.state.email
																						? this.state.email
																						: ''
																				}
																			/>
																			{
																				this.state.error.isEmailRequired &&
																				<div className="form-error">Email is required</div>
																			}
																			{
																				this.state.error.isValidEmail &&
																				<div className="form-error">Please enter a vaild email addreess</div>
																			}
																	</div>
																	<div className="text-center">
																		<button type="button" onClick={() => this.cancel()} className="btn btn-basic mr-2">
																			<span>Cancel</span>
																		</button>
																		<button type="button" onClick={()=> this.addDriver()} className="btn btn-success mr-2">
																			{
																				isSubmitAddDriver &&	
																				<i className="mdi mdi-spin mdi-loading"></i>
																			}
																			{
																				!isSubmitAddDriver &&
																				<span>Save</span>
																			}
																		</button>
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