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

	var request = this.oauth.post(url,
		this.options.access_token_key,
		this.options.access_token_secret,
		params);

	var streamparser = new Parser();
	streamparser.destroy = function() {
		// FIXME: should we emit end/close on explicit destroy?
		if ( typeof request.abort === 'function' )
			request.abort(); // node v0.4.0
		else
			request.socket.destroy();
	};

	request.on('response', function(response) {
		// FIXME: Somehow provide chunks of the response when the stream is connected
		// Pass HTTP response data to the parser, which raises events on the stream
    response.on('follow', function(chunk){
      stream.receive(chunk);
    });

    response.on('favorite', function(chunk){
      stream.receive(chunk);
    });

    response.on('unfavorite', function(chunk){
      stream.receive(chunk);
    });

    response.on('block', function(chunk){
      stream.receive(chunk);
    });

    response.on('unblock', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_created', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_destroyed', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_updated', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_member_added', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_member_removed', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_user_subscribed', function(chunk){
      stream.receive(chunk);
    });

    response.on('list_user_unsubscribed', function(chunk){
      stream.receive(chunk);
    });

    response.on('user_update', function(chunk){
      stream.receive(chunk);
    });

		response.on('data', function(chunk) {
			streamparser.receive(chunk);
		});

		response.on('error', function(error) {
			streamparser.emit('error', error);
		});

		response.on('end', function() {
			streamparser.emit('end', response);
		});
	});

	request.on('error', function(error) {
		streamparser.emit('error', error);
	});
	request.end();

	if ( typeof callback === 'function' ) callback(streamparser);
	return this;
}

module.exports = {
	stream: stream
};