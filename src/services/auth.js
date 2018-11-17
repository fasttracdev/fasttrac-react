import React from 'react';
import { Redirect } from 'react-router-dom'
import auth0 from 'auth0-js';

export default class Auth {

	state = {
	    isRedirect: false
	}

	auth0 = new auth0.WebAuth({
		domain: 'ddx.auth0.com',
		clientID: '1xw2DSMpt6VAdbH7bZH9XKnRBOX9D2M7',
		responseType: 'code',
		redirectUri: 'http://localhost:8000/callback',
		scope: 'email openid'
	});

	constructor() {
	  	this.login = this.login.bind(this);
	  	this.logout = this.logout.bind(this);
	  	this.isAuthenticated = this.isAuthenticated.bind(this);
	}

	login() {
		this.auth0.authorize();
	}

  	setSession(authResult) {
	    // Set the time that the Access Token will expire at
	    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
	    localStorage.setItem('access_token', authResult.accessToken);
	    localStorage.setItem('id_token', authResult.idToken);
	    localStorage.setItem('expires_at', expiresAt);
	}

	logout() {
	    // Clear Access Token and ID Token from local storage
	    localStorage.removeItem('access_token');
	    localStorage.removeItem('id_token');
	    localStorage.removeItem('expires_at');
	    this.auth0.logout({
	    	returnTo: 'http://localhost:8000/home',
  			clientID: '1xw2DSMpt6VAdbH7bZH9XKnRBOX9D2M7'
	    });
	}

	isAuthenticated() {
	    // Check whether the current time is past the 
	    // Access Token's expiry time
	    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	    return new Date().getTime() < expiresAt;
	}
}