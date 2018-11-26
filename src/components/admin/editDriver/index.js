/**
 * Import Section
 */
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPatch, httpGet } from '../../../services/https';
import { getUserDataFromLocalStorage} from '../../../services/helper';
import '../style.css';


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
		isRequesting: false,
		error: {
			isFirstNameRequired: false,
			isLastNameRequired: false,
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

	/**
	 * Edit Driver
	 */
	editDriver() {
		if(this.state.isSubmitEditDriver) {
			return;
		}
		this.setState({
			isSubmitEditDriver: true,
			isRequesting: true
		});
		var checkFormValidation = this.checkAddDriverValidation();
		var id = this.props.match.params.id;
		if(checkFormValidation) {
			var data = {
				first_name: this.state.firstName,
				last_name: this.state.lastName
			}
			httpPatch('/user/update/' + id, data).then((success)=> {
				this.setState({
					isSubmitEditDriver: false,
					isRequesting: false
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
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (!Array.isArray(err.errors) && err.errors && err.errors.message) {
			this.props.enqueueSnackbar(err.errors.message, {
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (!Array.isArray(err.errors) && err.errors && !err.errors.message) {
			this.props.enqueueSnackbar(err.errors, {
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
											        <div className="text-center">
												        <button type="button" onClick={()=> this.editDriver()} className="btn btn-success mr-2">
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