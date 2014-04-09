var Cookies = require('cookies'),
  merge = require('./merge'),
  util = require('./util');

/*
 * TWITTER "O"AUTHENTICATION UTILITIES, INCLUDING THE GREAT
 * CONNECT/STACK STYLE TWITTER "O"AUTHENTICATION MIDDLEWARE
 * and helpful utilities to retrieve the twauth cookie etc.
 */
function cookie(req) {
	// Fetch the cookie
	var cookies = new Cookies(req, null, this.keygrip);
	return util.readCookie(cookies, this.options);
}

function login(mount, success) {
	var self = this,
		url = require('url');

	// Save the mount point for use in gatekeeper
	this.options.login_mount = mount = mount || '/twauth';

	// Use secure cookie if forced to https and haven't configured otherwise
	if ( this.options.secure && !this.options.cookie_options.secure )
		this.options.cookie_options.secure = true;

	return function handle(req, res, next) {
		var path = url.parse(req.url, true);

		// We only care about requests against the exact mount point
		if ( path.pathname !== mount ) return next();

		// Set the oauth_callback based on this request if we don't have it
		if ( !self.oauth._authorize_callback ) {
			// have to get the entire url because this is an external callback
			// but it's only done once...
			var scheme = (req.socket.secure || self.options.secure) ? 'https://' : 'http://';
			path = url.parse(scheme + req.headers.host + req.url, true);
			self.oauth._authorize_callback = path.href;
		}

		// Fetch the cookie
		var cookies = new Cookies(req, res, self.keygrip);
		var twauth = util.readCookie(cookies, self.options);

		// We have a winner, but they're in the wrong place
		if ( twauth && twauth.user_id && twauth.access_token_secret ) {
			res.writeHead(302, {'Location': success || '/'});
			res.end();
			return;

		// Returning from Twitter with oauth_token
		} else if ( path.query && path.query.oauth_token && path.query.oauth_verifier && twauth && twauth.oauth_token_secret ) {
			self.oauth.getOAuthAccessToken(
				path.query.oauth_token,
				twauth.oauth_token_secret,
				path.query.oauth_verifier,
			function(error, access_token_key, access_token_secret, params) {
				// FIXME: if we didn't get these, explode
				var user_id = (params && params.user_id) || null,
					screen_name = (params && params.screen_name) || null;

				if ( error ) {
					// FIXME: do something more intelligent
					return next(500);
				} else {
					// store access token
					self.options.access_token_key = twauth.access_token_key;
 					self.options.access_token_secret = twauth.access_token_secret;
					cookies.set(self.options.cookie, JSON.stringify({
						user_id: user_id,
						screen_name: screen_name,
						access_token_key: access_token_key,
						access_token_secret: access_token_secret
					}), self.options.cookie_options);
					res.writeHead(302, {'Location': success || '/'});
					res.end();
					return;
				}
			});

		// Begin OAuth transaction if we have no cookie or access_token_secret
		} else if ( !(twauth && twauth.access_token_secret) ) {
			self.oauth.getOAuthRequestToken(
			function(error, oauth_token, oauth_token_secret, oauth_authorize_url, params) {
				if ( error ) {
					// FIXME: do something more intelligent
					return next(500);
				} else {
					cookies.set(self.options.cookie, JSON.stringify({
						oauth_token: oauth_token,
						oauth_token_secret: oauth_token_secret
					}), self.options.cookie_options);
					res.writeHead(302, {
						'Location': self.options.authorize_url + '?' +
							  querystring.stringify({oauth_token: oauth_token})
					});
					res.end();
					return;
				}
			});

		// Broken cookie, clear it and return to originating page
		// FIXME: this is dumb
		} else {
			cookies.set(self.options.cookie, null, self.options.cookie_options);
			res.writeHead(302, {'Location': mount});
			res.end();
			return;
		}
	};
}

function gatekeeper(options) {
	var self = this,
		mount = this.options.login_mount || '/twauth',
        defaults = {
            failureRedirect: null
        };
    options = merge(defaults, options);

	return function(req, res, next) {
		var twauth = self.cookie(req);

		// We have a winner
		if ( twauth && twauth.user_id && twauth.access_token_secret ) {
			self.options.access_token_key = twauth.access_token_key;
 			self.options.access_token_secret = twauth.access_token_secret;
			return next();
		}

    if (options.failureRedirect) {
        res.redirect(options.failureRedirect);
    } else {
        res.writeHead(401, {}); // {} for bug in stack
        res.end([
            '<html><head>',
            '<meta http-equiv="refresh" content="1;url=' + mount + '">',
            '</head><body>',
            '<h1>Twitter authentication required.</h1>',
            '</body></html>'
        ].join(''));
    }
	};
}

module.exports = {
	cookie: cookie,
	login: login,
	gatekeeper: gatekeeper
};
