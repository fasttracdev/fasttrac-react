import React from 'react';
import { Redirect } from 'react-router-dom'
import auth0 from 'auth0-js';
import Environment from '../environment/env'
export default class Auth {
	_env = new Environment();

	state = {
	    isRedirect: false
	}
	
	auth0 = new auth0.WebAuth({
		domain: this._env.getENV().DOMAIN,
		clientID: this._env.getENV().CLIENTID,
		responseType: this._env.getENV().CODE,
		redirectUri: this._env.getENV().APP_BASE_URL + '/callback',
		scope: this._env.getENV().SCOPE
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
		localStorage.clear();
	    this.auth0.logout({
			returnTo: this._env.getENV().APP_BASE_URL + '/home',
		 	clientID: this._env.getENV().CLIENTID
	    });
	}

	isAuthenticated() {
	    // Check whether the current time is past the 
	    // Access Token's expiry time
	    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	    return new Date().getTime() < expiresAt;
	}
}