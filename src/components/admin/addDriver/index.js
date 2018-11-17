import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Swal from 'sweetalert2';
import Table from 'rc-table';
import validator from 'validator';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPost } from '../../../services/https';
import { getUserDataFromLocalStorage, convertFormattedDate } from '../../../services/helper';
import MESSAGES from '../../../services/messages';
import '../style.css';

// Components
import Sidebar from '../sidebar';
import Topbar from '../topbar';


class AdminAddDriver extends Component {

	state = {
		isSubmitAddDriver: false,
		firstName: '',
		lastName: '',
		email: '',
		error: {
			isFirstNameRequired: false,
			isLastNameRequired: false,
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

	addDriver() {
		if(this.state.isSubmitAddDriver) {
			return;
		}
		this.setState({
			isSubmitAddDriver: true
		});

		var checkFormValidation = this.checkAddDriverValidation();
		if(checkFormValidation) {
			var data = {
				first_name: this.state.firstName,
				last_name: this.state.lastName,
				email: this.state.email,
				role: 'driver'
			}
			httpPost('/user/create', data).then((success)=> {
				this.setState({
					isSubmitAddDriver: false
				});
				this.props.history.push('/admin/drivers');
			}, (err) => {
				this.setState({
					isSubmitAddDriver: false
				});
			});
		}else {
			this.setState({
				isSubmitAddDriver: false
			});
		}
	}

	checkAddDriverValidation() {
		if(this.state.firstName === '' || this.state.firstName === null || this.state.firstName.length < 1) {
			this.setState({
				error: {
					isFirstNameRequired: true,
					isLastNameRequired: false,
					isEmailRequired: false,
					isValidEmail: false
				}
			})
			return false;
		}

		if(this.state.lastName === '' || this.state.lastName === null || this.state.lastName.length < 1) {
			this.setState({
				error: {
					isFirstNameRequired: false,
					isLastNameRequired: true,
					isEmailRequired: false,
					isValidEmail: false
				}
			})
			return false;
		}

		if(this.state.email === '' || this.state.email === null || this.state.email.length < 1) {
			this.setState({
				error: {
					isFirstNameRequired: false,
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
					isFirstNameRequired: false,
					isLastNameRequired: false,
					isEmailRequired: false,
					isValidEmail: true
				}
			})
			return false;
		}

		this.setState({
			error: {
				isFirstNameRequired: false,
				isLastNameRequired: false,
				isEmailRequired: false,
				isValidEmail: false
			}
		})

		return true;
	}

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

					<div className="main-panel">
						<div className="content-wrapper">
							<div className="row justify-content-center">
								<div className="col-lg-6 grid-margin stretch-card">
							        <div className="card">
								        <div className="card-body">
								            <h2 className="card-title">Add Driver</h2>
								            <div className="text-left">
										        <form className="forms-sample">
											        <div className="form-group">
											          	<label htmlFor="exampleInputName1">First Name</label>
											          	<input 
											          		type="text" 
											          		className="form-control" 
											          		onChange={(event) => this.state.firstName = event.target.value}
											          		placeholder="First Name" />
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
											          		onChange={(event) => this.state.lastName = event.target.value}
											          		placeholder="Last Name" />
											          	{
											          		this.state.error.isLastNameRequired &&
											          		<div className="form-error">Last Name is required</div>
											          	}
											        </div>
											        <div className="form-group">
											          	<label htmlFor="exampleInputEmail3">Email address</label>
											          	<input 
											          		type="email" 
											          		className="form-control" 
											          		onChange={(event) => this.state.email = event.target.value}
											          		id="exampleInputEmail3" 
											          		placeholder="Email" />
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
									<a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved.
								</span>
							</div>
						</footer>
					</div>
				</div>
			</div>
		);
	}
}

export default withSnackbar(withRouter(AdminAddDriver));