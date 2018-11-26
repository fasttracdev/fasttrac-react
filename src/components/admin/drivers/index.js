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

/**
 * Class Declaration
 */
class AdminDrivers extends Component {
	user = {};
	/**
	 * state
	 */
	state = {
		drivers: [],
		isRequesting: false
	};

	/**
	 * Column
	 */
	columns = [
		{ title: 'Avatar', dataIndex: 'picture', key:'picture', width: 20, render: (val)=> <img src={val} /> },
		{ title: 'Name', dataIndex: 'name', key:'name', width: 1000 }, 
		{ title: 'Email', dataIndex: 'email', key:'email', width: 1000 },
		{ title: 'Account Status', dataIndex: 'email_verified', key:'email_verified', width: 1000, render: (val)=> <div>{(val) ? 'Verified' : 'Not Verified'}</div> },
		{ title: 'Created At', dataIndex: 'created_at', key:'created_at', width: 1000, render: (val)=> <div>{ convertFormattedDate(val) }</div> },
		{ title: 'Actions', dataIndex: 'user_id', key:'operations', 
			render: (val) => <div><button type="button" title="Edit" onClick={()=> { this.editDriver(val) }} className="btn margin-right10 btn-icons btn-rounded btn-inverse-outline-primary"><i className="mdi mdi-account-edit"></i></button><button title="Delete" type="button" onClick={() => {this.openDeletePopUp(val)}} className="btn btn-icons btn-rounded btn-inverse-outline-primary"><i className="mdi mdi-delete"></i></button></div>
		}
	];

	/**
	 * When Component Did Mount
	 */
	componentDidMount() {
		this.setState({
			isRequesting: true
		})
		httpGet('/user/drivers').then((success)=> {
			success.data.forEach(function(element, key) {
			  	element.key = key;
			  	element.name = element.user_metadata.first_name + ' ' + element.user_metadata.last_name;
			});
			this.setState({
				drivers: success.data,
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
					this.setState({
						drivers: this.state.drivers,
						isRequesting: false
					});
					this.props.enqueueSnackbar(MESSAGES.DRIVER_DELETED, {
						variant: 'success',
						autoHideDuration: 3000
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
				variant: 'error',
				autoHideDuration: 3000
			});
		}
		if (err.errors && !err.errors.message) {
			this.props.enqueueSnackbar(err.errors, {
				variant: 'error',
				autoHideDuration: 3000
			});
		}	
		this.setState({
			isRequesting: false
		})
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
							<div className="row">
								<div className="col-lg-12 grid-margin stretch-card">
							        <div className="card">
								        <div className="card-body">
								            <h2 className="card-title">Drivers Listing</h2>
								            <button type="button" className="btn btn-primary btn-fw add-driver-btn" onClick={()=> {this.gotoRoute('/admin/drivers/add')}}>
                          						<i className="mdi mdi-account-plus"></i>Add Driver
                          					</button>
								            <div className="table-responsive">
								            	{
								            		drivers &&
								            		<Table columns={this.columns} className="table table-bordered" data={this.state.drivers} />
								            	}
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

export default withSnackbar(withRouter(AdminDrivers));