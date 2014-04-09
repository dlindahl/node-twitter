var	VERSION = '0.2.9',
	http = require('http'),
	querystring = require('querystring'),
	oauth = require('oauth'),
	Keygrip = require('keygrip'),
	merge = require('./merge');

function Twitter(options) {
	if (!(this instanceof Twitter)) return new Twitter(options);

	var defaults = {
		consumer_key: null,
		consumer_secret: null,
		access_token_key: null,
		access_token_secret: null,

		headers: {
			'Accept': '*/*',
			'Connection': 'close',
			'User-Agent': 'node-twitter/' + VERSION
		},

		request_token_url: 'https://api.twitter.com/oauth/request_token',
		access_token_url: 'https://api.twitter.com/oauth/access_token',
		authenticate_url: 'https://api.twitter.com/oauth/authenticate',
		authorize_url: 'https://api.twitter.com/oauth/authorize',
		callback_url: null,

		rest_base: 'https://api.twitter.com/1.1',
		stream_base: 'https://stream.twitter.com/1.1',
		search_base: 'https://api.twitter.com/1.1/search',
		user_stream_base: 'https://userstream.twitter.com/1.1',
		site_stream_base: 'https://sitestream.twitter.com/1.1',
		filter_stream_base: 'https://stream.twitter.com/1.1/statuses',

		secure: false, // force use of https for login/gatekeeper
		cookie: 'twauth',
		cookie_options: {},
		cookie_secret: null
	};
	this.options = merge(defaults, options);

	this.keygrip = this.options.cookie_secret === null ? null :
		new Keygrip([this.options.cookie_secret]);

	this.oauth = new oauth.OAuth(
		this.options.request_token_url,
		this.options.access_token_url,
		this.options.consumer_key,
		this.options.consumer_secret,
		'1.0',
		this.options.callback_url,
		'HMAC-SHA1', null,
		this.options.headers
	);
}
Twitter.VERSION = VERSION;
module.exports = Twitter;

merge(Twitter.prototype, require('./api/rest'));
merge(Twitter.prototype, require('./api/stream'));
merge(Twitter.prototype, require('./oauth'));
merge(Twitter.prototype, require('./resources/timeline'));
merge(Twitter.prototype, require('./resources/tweet'));
merge(Twitter.prototype, require('./resources/user'));
merge(Twitter.prototype, require('./resources/trends'));
merge(Twitter.prototype, require('./resources/list'));
merge(Twitter.prototype, require('./resources/list/members'));
merge(Twitter.prototype, require('./resources/list/subscribers'));
merge(Twitter.prototype, require('./resources/direct_message'));
merge(Twitter.prototype, require('./resources/friends'));
merge(Twitter.prototype, require('./resources/followers'));
merge(Twitter.prototype, require('./resources/account'));
merge(Twitter.prototype, require('./resources/favorites'));
merge(Twitter.prototype, require('./resources/block'));
merge(Twitter.prototype, require('./resources/spam'));
merge(Twitter.prototype, require('./resources/saved_searches'));
merge(Twitter.prototype, require('./resources/geo'));
merge(Twitter.prototype, require('./resources/deprecated'));

/*
 * INTERNAL UTILITY FUNCTIONS
 */

Twitter.prototype._readCookie = function(cookies) {
	// parse the auth cookie
	try {
		return JSON.parse(cookies.get(this.options.cookie));
	} catch (error) {
		return null;
	}
};
