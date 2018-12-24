/**
 * Import Section
 */
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPatch, httpGet } from '../../../services/https';
import { getUserDataFromLocalStorage} from '../../../services/helper';
import '../style.css';
import MESSAGES from '../../../services/messages';
import validator from 'validator';


// Components
import Sidebar from '../sidebar';
import Loader from '../../../Loader/loader'
import Topbar from '../topbar';

/**
 * Class Declaration
 */
class AdminEditDriver extends Component {
	/**
	 * state
	 */
	state = {
		isSubmitEditDriver: false,
		firstName: '',
		lastName: '',
		email: '',
		address: '',
		city: '',
		phone: '',
		isRequesting: false,
		error: {
			isFirstNameRequired: false,
			isLastNameRequired: false,
			isEmailRequired: false,
			isValidEmail: false
		}
	};

	/**
	 * When Component did monunt
	 */
	componentDidMount() {
		this.setState({
			isRequesting: true
		})
		var id = this.props.match.params.id;
		httpGet('/user/profile/' + id).then((success)=> {
			var userMeta = success.data.user_metadata;
			this.setState({
				firstName: userMeta.first_name,
				lastName: userMeta.last_name,
				address: userMeta.address,
				city: userMeta.city,
				email: success.data.email,
				phone: userMeta.phone,
				isRequesting: false
			});
		}, (err) => {
			this.handleErrorMessage(err);
		});
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

  /* Constructor */
	constructor(props) {
	  super(props);
	  this.user = getUserDataFromLocalStorage();
	}

	/**
	 *  Cancel Button
	 */
	cancel() {
		this.props.history.push('/admin/drivers');
	}

	/**
	 * Edit Driver
	 */
	updateDriver() {
		if(this.state.isSubmitEditDriver) {
			return;
		}
		this.setState({
			isSubmitEditDriver: true,
		});
		var checkFormValidation = this.checkAddDriverValidation();
		var id = this.props.match.params.id;
		if(checkFormValidation) {
			this.setState({
				isRequesting: true
			});
			var data = {
				first_name: this.state.firstName,
				last_name: this.state.lastName,
				email: this.state.email,
				address: this.state.address,
				city:this.state.city,
				phone: this.formatPhone(this.state.phone)
			}
			httpPatch('/user/update/' + id, data).then((success)=> {
				this.setState({
					isSubmitEditDriver: false,
					isRequesting: false
				});
				this.props.enqueueSnackbar(MESSAGES.DRIVER_UPDATED, {
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
					isSubmitEditDriver: false
				});
			});
		}else {
			this.setState({
				isSubmitEditDriver: false
			});
		}
	}
	
	/**
	 * Validation
	 */
	checkAddDriverValidation() {
		if(this.state.firstName === '' || this.state.firstName === null || this.state.firstName.length < 1) {
			this.setState({
				error: {
					isFirstNameRequired: true,
					isLastNameRequired: false
				}
			})
			return false;
		}

		if(this.state.lastName === '' || this.state.lastName === null || this.state.lastName.length < 1) {
			this.setState({
				error: {
					isFirstNameRequired: false,
					isLastNameRequired: true
				}
			})
			return false;
		}

		if (this.state.email === '' || this.state.email === null || this.state.email.length < 1) {
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

		if (!validator.isEmail(this.state.email)) {
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
				isFirstNameRequired: false,
				isLastNameRequired: false
			}
		})

		return true;
	}

	/**
	 * handle error message
	 */
	handleErrorMessage(err) {
		if (Array.isArray(err.errors)) {
			this.props.enqueueSnackbar(err.errors[0].params + ' is required', {
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
	 * Render HTML
	 */
	render() {
		const { user } = this.user;
		const { isSubmitEditDriver } = this.state;
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
								            <h2 className="card-title">Edit Driver</h2>
								            <div className="text-left">
										        <form className="forms-sample">
											        <div className="form-group">
											          	<label htmlFor="exampleInputName1">First Name</label>
											          	<input 
											          		type="text" 
											          		className="form-control" 
											          		onChange={(event) => {
												          		this.setState({
												          			firstName: event.target.value	
												          		})
											          		}}
											          		placeholder="First Name"
											          		value={this.state.firstName} />
											          	{
											          		this.state.error.isFirstNameRequired &&
											          		<div className="form-error">First Name is required</div>
											          	}
											        </div>
											        <div className="form-group">
											          	<label htmlFor="exampleInputName1">Last Name</label>
											          	<input 
											          		type="text" 
											          		className="form-control" 
											          		onChange={(event) => {
												          		this.setState({
												          			lastName: event.target.value	
												          		})
											          		}}
											          		placeholder="Last Name"
											          		value={this.state.lastName} />
											          	{
											          		this.state.error.isLastNameRequired &&
											          		<div className="form-error">Last Name is required</div>
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
																			? this.formatPhone(this.state.phone)
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
																	<div className="form-error">Please enter a vaild email address</div>
																}
															</div>

											        <div className="text-center">
																<button type="button" onClick={() => this.cancel()} className="btn btn-basic mr-2">
																	<span>Cancel</span>
																</button>
												        <button type="button" onClick={()=> this.updateDriver()} className="btn btn-success mr-2">
												        	{
												        		isSubmitEditDriver &&	
												        		<i className="mdi mdi-spin mdi-loading"></i>
												        	}
												        	{
												        		!isSubmitEditDriver &&
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
export default withSnackbar(withRouter(AdminEditDriver));