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

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

// Favorites resources

Twitter.prototype.getFavorites = function(params, callback) {
	var url = '/favorites.json';
	this.get(url, params, callback);
	return this;
};

Twitter.prototype.createFavorite = function(id, params, callback) {
	var url = '/favorites/create/' + escape(id) + '.json';
	this.post(url, params, null, callback);
	return this;
};

Twitter.prototype.favoriteStatus = Twitter.prototype.createFavorite;

Twitter.prototype.destroyFavorite = function(id, params, callback) {
	var url = '/favorites/destroy/' + escape(id) + '.json';
	this.post(url, params, null, callback);
	return this;
};

Twitter.prototype.deleteFavorite = Twitter.prototype.destroyFavorite;

// Notification resources

// Block resources

Twitter.prototype.createBlock = function(id, callback) {
	var url = '/blocks/create.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.post(url, params, null, callback);
	return this;
};

Twitter.prototype.blockUser = Twitter.prototype.createBlock;

Twitter.prototype.destroyBlock = function(id, callback) {
	var url = '/blocks/destroy.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.post(url, params, null, callback);
	return this;
};

Twitter.prototype.unblockUser = Twitter.prototype.destroyBlock;

Twitter.prototype.blockExists = function(id, callback) {
	var url = '/blocks/exists.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.get(url, params, null, callback);
	return this;
};

Twitter.prototype.isBlocked = Twitter.prototype.blockExists;

// FIXME: blocking section not complete (blocks/blocking + blocks/blocking/ids)

// Spam Reporting resources

Twitter.prototype.reportSpam = function(id, callback) {
	var url = '/report_spam.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.post(url, params, null, callback);
	return this;
};

// Saved Searches resources

Twitter.prototype.savedSearches = function(callback) {
	var url = '/saved_searches.json';
	this.get(url, null, callback);
	return this;
};

Twitter.prototype.showSavedSearch = function(id, callback) {
	var url = '/saved_searches/' + escape(id) + '.json';
	this.get(url, null, callback);
	return this;
};

Twitter.prototype.createSavedSearch = function(query, callback) {
	var url = '/saved_searches/create.json';
	this.post(url, {query: query}, null, callback);
	return this;
};
Twitter.prototype.newSavedSearch =
	Twitter.prototype.createSavedSearch;

Twitter.prototype.destroySavedSearch = function(id, callback) {
	var url = '/saved_searches/destroy/' + escape(id) + '.json?_method=DELETE';
	this.post(url, null, null, callback);
	return this;
};
Twitter.prototype.deleteSavedSearch =
	Twitter.prototype.destroySavedSearch;

// OAuth resources

// Geo resources

Twitter.prototype.geoSearch = function(params, callback) {
	var url = '/geo/search.json';
	this.get(url, params, callback);
	return this;
};

Twitter.prototype.geoSimilarPlaces = function(lat, lng, name, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	} else if (typeof params !== 'object') {
		params = {};
	}

	if (typeof lat !== 'number' || typeof lng !== 'number' || !name) {
		callback(new Error('FAIL: You must specify latitude, longitude (as numbers) and name.'));
	}

	var url = '/geo/similar_places.json';
	params.lat = lat;
	params.long = lng;
	params.name = name;
	this.get(url, params, callback);
	return this;
};

Twitter.prototype.geoReverseGeocode = function(lat, lng, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	} else if (typeof params !== 'object') {
		params = {};
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		callback(new Error('FAIL: You must specify latitude and longitude as numbers.'));
	}

	var url = '/geo/reverse_geocode.json';
	params.lat = lat;
	params.long = lng;
	this.get(url, params, callback);
	return this;
};

Twitter.prototype.geoGetPlace = function(place_id, callback) {
	var url = '/geo/id/' + escape(place_id) + '.json';
	this.get(url, callback);
	return this;
};

// Legal resources

// Help resources

// Streamed Tweets resources

// Search resources

// Deprecated resources

Twitter.prototype.getPublicTimeline = function(params, callback) {
	var url = '/statuses/public_timeline.json';
	this.get(url, params, callback);
	return this;
};

Twitter.prototype.getFriendsTimeline = function(params, callback) {
	var url = '/statuses/friends_timeline.json';
	this.get(url, params, callback);
	return this;
};


/*
 * INTERNAL UTILITY FUNCTIONS
 */

Twitter.prototype._getUsingCursor = function(url, params, callback) {
	var key,
	  result = [],
	  self = this;

	params = params || {};
	key = params.key || null;

	// if we don't have a key to fetch, we're screwed
	if (!key)
		callback(new Error('FAIL: Results key must be provided to _getUsingCursor().'));
	delete params.key;

	// kick off the first request, using cursor -1
	params = merge(params, {cursor:-1});
	this.get(url, params, fetch);

	function fetch(data) {
		// FIXME: what if data[key] is not a list?
		if (data[key]) result = result.concat(data[key]);

		if (data.next_cursor_str === '0') {
			callback(result);
		} else {
			params.cursor = data.next_cursor_str;
			self.get(url, params, fetch);
		}
	}

	return this;
};

Twitter.prototype._readCookie = function(cookies) {
	// parse the auth cookie
	try {
		return JSON.parse(cookies.get(this.options.cookie));
	} catch (error) {
		return null;
	}
};
