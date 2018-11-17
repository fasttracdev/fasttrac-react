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
 	var convertedDate = moment(date.created_at);
 	return convertedDate.format(dateFormat);
}
