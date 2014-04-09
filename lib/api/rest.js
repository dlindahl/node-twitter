var http = require('http'),
  querystring = require('querystring'),
  merge = require('../merge');

/*
 * GET
 */
function get(url, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
	}

	if (url.charAt(0) == '/')
		url = this.options.rest_base + url;

	this.oauth.get(url + '?' + querystring.stringify(params),
		this.options.access_token_key,
		this.options.access_token_secret,
	function(error, data, response) {
		if (error) {
			var err = new Error('HTTP Error ' +
					error.statusCode + ': ' +
					http.STATUS_CODES[error.statusCode]);
			err.statusCode = error.statusCode;
			err.data = error.data;
			callback(err);
		} else {
			try {
				var json = JSON.parse(data);
				callback(json);
			} catch(err) {
				callback(err);
			}
		}
	});
	return this;
}

/*
 * POST
 */
function post(url, content, content_type, callback) {
	if (typeof content === 'function') {
		callback = content;
		content = null;
		content_type = null;
	} else if (typeof content_type === 'function') {
		callback = content_type;
		content_type = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
	}

	if (url.charAt(0) == '/')
		url = this.options.rest_base + url;

	// Workaround: oauth + booleans == broken signatures
	if (content && typeof content === 'object') {
		Object.keys(content).forEach(function(e) {
			if ( typeof content[e] === 'boolean' )
				content[e] = content[e].toString();
		});
	}

	this.oauth.post(url,
		this.options.access_token_key,
		this.options.access_token_secret,
		content, content_type,
	function(error, data, response) {
		if (error) {
			var err = new Error('HTTP Error ' +
				  error.statusCode + ': ' +
				  http.STATUS_CODES[error.statusCode]);
			err.statusCode = error.statusCode;
			err.data = error.data;
			callback(err);
		} else {
			try {
				var json = JSON.parse(data);
				callback(json);
			} catch(err) {
				callback(err);
			}
		}
	});
	return this;
}

/*
 * SEARCH (not API stable!)
 */
function search(q, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
	}

	var url = this.options.search_base + '/tweets.json';
	params = merge(params, {q:q});
	this.get(url, params, callback);
	return this;
}

module.exports = {
	get: get,
	post: post,
	search: search
};