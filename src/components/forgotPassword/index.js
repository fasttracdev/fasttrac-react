/**
 * Import section
 */
import React, { Component } from 'react';
import Auth from '../../services/auth.js';
import Environment from '../../environment/env'
import validator from 'validator';
import { httpPost } from '../../services/https';
import MESSAGES from '../../services/messages';
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router"
const auth = new Auth();

/**
 * Calss
 */
class ForgotPassword extends Component {
  _env = new Environment();

  /**
	 * state
	 */
  state = {
    email: '',
    isRequesting: false,
    error: {
      isEmailRequired: false,
      isValidEmail: false
    }
  };

	/**
	 * Send Email
	 */
  sendEmail() {    
    this.setState({
      isRequesting: true
    });
    var checkFormValidation = this.checkAddDriverValidation();
    if (checkFormValidation) {
      setTimeout(() => {
        var data = {         
          email: this.state.email,
        }
        httpPost('/user/forgot-password', data).then((success) => {
          this.props.enqueueSnackbar(success.data, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
            autoHideDuration: 3000
          });
          this.props.history.push('/home');
        }, (err) => {
          this.handleErrorMessage(err);
        });
      }, 200)
    } else {
      this.setState({
        isRequesting: false
      });
    }
  }

  /**
 * Validation
 */
  checkAddDriverValidation() {
    if (this.state.email === '' || this.state.email === null || this.state.email.length < 1) {
      this.setState({
        error: {
          isEmailRequired: true,
          isValidEmail: false
        }
      })
      return false;
    }

    if (!validator.isEmail(this.state.email)) {
      this.setState({
        error: {
          isEmailRequired: false,
          isValidEmail: true
        }
      })
      return false;
    }

    this.setState({
      error: {
        isEmailRequired: false,
        isValidEmail: false
      }
    })

    return true;
  }

  /**
 * handle error message
 */
  handleErrorMessage(err) {
    if (err.errors && err.errors.message) {
      this.props.enqueueSnackbar(err.errors.message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
        autoHideDuration: 3000
      });
    }
    if (err.errors && !err.errors.message) {
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
    })
  }

	/**
	 * Render HTML
	 */
  render() {
    return (
      <div>
        <div className="container-scroller">
          <div className="container-fluid page-body-wrapper full-page-wrapper auth-page">
            <div className="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
              <div className="row w-100">
                <div className="col-lg-4 mx-auto">
                  <div className="auto-form-wrapper">
                    <div className="auth0-logo">
                      <img src={this._env.getENV().ImagePath + "/images/auth0-logo-blue.png"} alt="auth0-logo" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail3">Please Enter A Valid Email Address</label>
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
                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block" onClick={() => this.sendEmail()}>Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/**
 * Export Section
 */
export default withSnackbar(withRouter(ForgotPassword));