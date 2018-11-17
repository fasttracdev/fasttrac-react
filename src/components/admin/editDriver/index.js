import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Swal from 'sweetalert2';
import Table from 'rc-table';
import { withRouter } from "react-router";
import { withSnackbar } from 'notistack';
import { httpPatch, httpGet } from '../../../services/https';
import { getUserDataFromLocalStorage, convertFormattedDate } from '../../../services/helper';
import MESSAGES from '../../../services/messages';
import '../style.css';

// Components
import Sidebar from '../sidebar';
import Topbar from '../topbar';


class AdminEditDriver extends Component {

	state = {
		isSubmitEditDriver: false,
		firstName: '',
		lastName: '',
		error: {
			isFirstNameRequired: false,
			isLastNameRequired: false,
		}
	};

	componentDidMount() {
		console.log(this.props.match.params.id);
		var id = this.props.match.params.id;
		httpGet('/user/profile/' + id).then((success)=> {
			console.log(success);
			var userMeta = success.data.user_metadata;
			this.setState({
				firstName: userMeta.first_name,
				lastName: userMeta.last_name,
			});
		}, (err) => {
			
		});
	}

    /* Constructor */
	constructor(props) {
	    super(props);
	    this.user = getUserDataFromLocalStorage();
	}

	editDriver() {
		if(this.state.isSubmitEditDriver) {
			return;
		}
		this.setState({
			isSubmitEditDriver: true
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
					isSubmitEditDriver: false
				});
				this.props.history.push('/admin/drivers');
			}, (err) => {
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

export default withSnackbar(withRouter(AdminEditDriver));