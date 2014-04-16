var Socket = require('../socket');
var Stream = require('../stream');

/*
 * STREAM
 */
function stream(method, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var stream_base = this.options.stream_base;

	// Stream type customisations
	if (method === 'user') {
		stream_base = this.options.user_stream_base;
		// Workaround for node-oauth vs. twitter commas-in-params bug
		if ( params && params.track && Array.isArray(params.track) ) {
			params.track = params.track.join(',');
		}

	} else if (method === 'site') {
		stream_base = this.options.site_stream_base;
		// Workaround for node-oauth vs. twitter double-encode-commas bug
		if ( params && params.follow && Array.isArray(params.follow) ) {
			params.follow = params.follow.join(',');
		}
	} else if (method === 'filter') {
		stream_base = this.options.filter_stream_base;
		// Workaround for node-oauth vs. twitter commas-in-params bug
		if ( params && params.track && Array.isArray(params.track) ) {
			params.track = params.track.join(',');
		}
	}

	var url = stream_base + '/' + escape(method) + '.json';
	var key = this.options.access_token_key;
	var secret = this.options.access_token_secret;

	var socket = new Socket(this.oauth, url, key, secret, params);
	socket.open();

	this.socket = socket;
	this.stream = new Stream(socket);

	if ( typeof callback === 'function' ) callback(this);
	return this;
}

module.exports = {
	stream: stream
};