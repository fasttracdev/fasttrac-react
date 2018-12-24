/**
 * Import Section
 */
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPatch, httpGet } from '../../../services/https';
import { getUserDataFromLocalStorage, formatPhone, handleValidation} from '../../../services/helper';
import '../style.css';
import MESSAGES from '../../../services/messages';
// Components
import Sidebar from '../sidebar';
import Loader from '../../../Loader/loader'
import Topbar from '../topbar';

/**
 * Class Declaration
 */
class AdminEditDriver extends Component {
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
		isRequesting: false
	}

	/**
	 * When component did mount
	 */
	componentDidMount() {
		this.setState({
			isRequesting: true
		})
		var id = this.props.match.params.id;
		httpGet('/user/profile/' + id).then((success) => {
			var userMeta = success.data.user_metadata;
			this.setState({
				fields: {
					first_name: userMeta.first_name,
					last_name: userMeta.last_name,
					address: userMeta.address,
					city: userMeta.city,
					email: success.data.email,
					phone: userMeta.phone,
				},
				isRequesting: false
			});
		}, (err) => {
			this.handleErrorMessage(err);
		});
	}
	
	/**
	 * Edit Driver
	 */
	updateDriver() {
		var id = this.props.match.params.id;
		this.setState({
			isRequesting: true
		});
		var data = {
			first_name: this.state.fields.first_name,
			last_name: this.state.fields.last_name,
			email: this.state.fields.email,
			address: this.state.fields.address,
			city: this.state.fields.city,
			phone: formatPhone(this.state.fields.phone)
		}
		httpPatch('/user/update/' + id, data).then((success) => {
			this.setState({
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
			});		
	}

	/**
	 * Save Data
	 * @param {*} e 
	 */
	saveData(e) {
		var action = 'update';
		e.preventDefault();
		var data = handleValidation(this.state.fields, action);
		if (data.isValid) {
			this.updateDriver();
		}else {
			this.setState({
				errors: data.err
			})
		}
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
	 * handled Error Message
	 * @param {*} err 
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
		return (
			<div className="container-scroller">
				<Topbar user={user} />
				<div className="container-fluid page-body-wrapper">
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
													<form className="forms-sample" onSubmit={(e) => this.saveData(e)}>
														<div className="form-group">
															<label htmlFor="exampleInputName1">First Name</label>
															<input
																type="text"
																className="form-control"
																onChange={(e) => this.handleChange(e,"first_name")} value={this.state.fields.first_name ? this.state.fields.first_name : ''}
																placeholder="First Name"
																/>														
															<div className="form-error">{this.state.errors["first_name"]}</div>
														</div>
														<div className="form-group">
															<label htmlFor="exampleInputName1">Last Name</label>
															<input
																type="text"
																className="form-control"
																onChange={(e) => this.handleChange(e, "last_name")} value={this.state.fields.last_name ? this.state.fields.last_name : ''}
																placeholder="Last Name"
															/>
															<div className="form-error">{this.state.errors["last_name"]}</div>
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
																onChange={(e) => this.handleChange(e, "email")} value={this.state.fields.email ? this.state.fields.email: ''}
																placeholder="Email"
																disabled = "this.state.fields.email != ''"/>
															<div className="form-error">{this.state.errors["email"]}</div>
														</div>
														<div className="text-center">
															<button type="button" onClick={() => this.cancel()} className="btn btn-basic mr-2">
																<span>Cancel</span>
															</button>
															<button type="button" onClick={(e) => this.saveData(e)} className="btn btn-success mr-2">Save</button>
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
