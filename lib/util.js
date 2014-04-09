var merge = require('./merge');

function getUsingCursor(client, url, params, callback) {
	var key,
	  result = [];

	params = params || {};
	key = params.key || null;

	// if we don't have a key to fetch, we're screwed
	if (!key)
		callback(new Error('FAIL: Results key must be provided to getUsingCursor().'));
	delete params.key;

	// kick off the first request, using cursor -1
	params = merge(params, {cursor:-1});
	client.get(url, params, fetch);

	function fetch(data) {
		// FIXME: what if data[key] is not a list?
		if (data[key]) result = result.concat(data[key]);

		if (data.next_cursor_str === '0') {
			callback(result);
		} else {
			params.cursor = data.next_cursor_str;
			client.get(url, params, fetch);
		}
	}

	return client;
}

/*
 * INTERNAL UTILITY FUNCTIONS
 */

function readCookie(cookies, options) {
	options = options || {};

	// parse the auth cookie
	try {
		return JSON.parse(cookies.get(options.cookie));
	} catch (error) {
		return null;
	}
}

module.exports = {
	getUsingCursor: getUsingCursor,
	readCookie: readCookie
};