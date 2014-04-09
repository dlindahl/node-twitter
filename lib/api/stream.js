var Parser = require('../parser');

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

	var streamparser = new Parser(this.oauth, this.options);
	streamparser.connect(url,
		this.options.access_token_key,
		this.options.access_token_secret,
		params
	);

	if ( typeof callback === 'function' ) callback(streamparser);
	return this;
}

module.exports = {
	stream: stream
};