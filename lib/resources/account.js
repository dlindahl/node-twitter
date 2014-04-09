var merge = require('../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function verifyCredentials(callback) {
	var url = '/account/verify_credentials.json';
	this.get(url, null, callback);
	return this;
}

function rateLimitStatus(callback) {
	var url = '/application/rate_limit_status.json';
	this.get(url, null, callback);
	return this;
}

function updateProfile(params, callback) {
	// params: name, url, location, description
	var defaults = {
		include_entities: 1
	};
	params = merge(defaults, params);

	var url = '/account/update_profile.json';
	this.post(url, params, null, callback);
	return this;
}

// FIXME: Account resources section not complete

module.exports = {
	verifyCredentials: verifyCredentials,
	rateLimitStatus: rateLimitStatus,
	updateProfile: updateProfile
};