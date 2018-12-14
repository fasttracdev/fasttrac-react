import store from 'store';
var localStorageKeyName = "fastuserObject";
var dateFormat ="DD/M/YYYY";
const moment = require('moment');


/**
 * check is value is true or false
 *
 * @return Boolean value
 */
export const saveUserDataInLocalStorage = value => {
 	if (value === null) {
 		return false
 	}

 	store.set(localStorageKeyName, value);
}

export const isUserDataAvailableInLocalStorage = () => {
	var user = store.get(localStorageKeyName);
	if(user) {
		return true;
	}

	return false;
}

export const getUserDataFromLocalStorage = () => {
 	if(!isUserDataAvailableInLocalStorage()) {
 		return;
 	}

 	return store.get(localStorageKeyName);
}

export const convertFormattedDate = (date) => {
 	if(!date) {
 		return;
	 }
	var convertedDate = moment(date).format(dateFormat)
 	return convertedDate;
}

/**
* Format Cell Phone
*
* @param {String} phone
*
* @return {String}
*/
export const formatPhone = (phone) => {
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

export const handleValidation = (data, action) => {
	let fields = data
	let errors = {};
	let formIsValid = true;
	if(action==='add') {
		if (!fields["name"]) {
			formIsValid = false;
			errors["name"] = "Name is required.";
		}
	
		if (typeof fields["name"] !== "undefined") {
			if (!fields["name"].match(/^[a-zA-Z\s]+$/)) {
				formIsValid = false;
				errors["name"] = "Only letters are allowed.";
			}
		}
	}else {
		if (!fields["first_name"]) {
			formIsValid = false;
			errors["first_name"] = "First name is required.";
		}
	
		if (typeof fields["first_name"] !== "undefined") {
			if (!fields["first_name"].match(/^[a-zA-Z]+$/)) {
				formIsValid = false;
				errors["first_name"] = "Only letters are allowed.";
			}
		}
	
		if (!fields["last_name"]) {
			formIsValid = false;
			errors["last_name"] = "Last name is required.";
		}
	
		if (typeof fields["last_name"] !== "undefined") {
			if (!fields["last_name"].match(/^[a-zA-Z]+$/)) {
				formIsValid = false;
				errors["last_name"] = "Only letters are allowed.";
			}
		}
	}


	if (!fields["city"]) {
		formIsValid = false;
		errors["city"] = "City is required.";
	}

	if (!fields["address"]) {
		formIsValid = false;
		errors["address"] = "Address is required.";
	}

	//Email
	if (!fields["email"]) {
		formIsValid = false;
		errors["email"] = "Email is required.";
	}

	if (typeof fields["email"] !== "undefined") {
		let lastAtPos = fields["email"].lastIndexOf('@');
		let lastDotPos = fields["email"].lastIndexOf('.');

		if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
			formIsValid = false;
			errors["email"] = "Please enter a valid email.";
		}
	}

	if (!fields["phone"]) {
		formIsValid = false;
		errors["phone"] = "Phone number is required.";
	}

	if (typeof fields["phone"] !== "undefined") {
		if (fields["phone"].length < 14) {
			formIsValid = false;
			errors["phone"] = "Please enter a valid number.";
		}
	}

	errors = {
		err: errors,
		isValid: formIsValid
	}
	console.log(errors);
	return (errors);
}
