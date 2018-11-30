import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { httpPost } from '../../services/https';
import { saveUserDataInLocalStorage } from '../../services/helper';

class Callback extends Component {

    /* Constructor */
	constructor(props) {
	    super(props)
		if(this.props.location.search) {
			var string = this.props.location.search.split("?code=");
			var params = string[1].split("&");
			var data = {
				code: params[0]
			}
			httpPost('/sso-login/', data).then((success) => {
				saveUserDataInLocalStorage(success.data);
				if (success.data.user.user_metadata.role === 'admin') {
					this.props.history.push('/admin/dashboard');
				}else {
					this.props.history.push('/driver-report');
				}
			}, (err) => {
				console.log(err);
			});
		}
	}

	render() {
		return (
			<div className="loader-container">
				<div className="loader-inner-col">
					<Loader type="Ball-Triangle" color="#000000" height={80} width={80} />
				</div>
			</div>
		);
	}
}

export default Callback;