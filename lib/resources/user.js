var http = require('http'),
	querystring = require('querystring'),
  merge = require('../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function showUser(id, callback) {
	// FIXME: handle id-array and id-with-commas as lookupUser
	//  NOTE: params with commas b0rk between node-oauth and twitter
	//        https://github.com/ciaranj/node-oauth/issues/7
	var url = '/users/show.json';

	var params = {};

	if (typeof id === 'object' && id !== null) {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.get(url, params, callback);
	return this;
}

function searchUser(q, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/users/search.json';
	params = merge(params, {q:q});
	this.get(url, params, callback);
	return this;
}

// FIXME: users/suggestions**

function userProfileImage(id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	} else if (typeof params === 'string') {
		params = { size: params };
	}

	var url = '/users/profile_image/' + escape(id) + '.json?' + querystring.stringify(params);

	// Do our own request, so we can return the 302 location header
	var request = this.oauth.get(this.options.rest_base + url,
		this.options.access_token_key,
		this.options.access_token_secret);
	request.on('response', function(response) {
		// return the location or an HTTP error
		callback(response.headers.location || new Error('HTTP Error ' +
			  response.statusCode + ': ' +
			  http.STATUS_CODES[response.statusCode]));
	});
	request.end();

	return this;
}

// FIXME: statuses/friends, statuses/followers

module.exports = {
	showUser: showUser,
	lookupUser: showUser,
	lookupUsers: showUser,
	searchUser: searchUser,
	searchUsers: searchUser,
	userProfileImage: userProfileImage
};