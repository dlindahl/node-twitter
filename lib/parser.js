// glorious streaming json parser, built specifically for the twitter streaming api
// assumptions:
//   1) ninjas are mammals
//   2) tweets come in chunks of text, surrounded by {}'s, separated by line breaks
//   3) only one tweet per chunk
//
//   p = new parser.instance()
//   p.addListener('object', function...)
//   p.receive(data)
//   p.receive(data)
//   ...

var EventEmitter = require('events').EventEmitter;

function Parser(oauth, options) {
	// Make sure we call our parents constructor
	EventEmitter.call(this);
	this.oauth = oauth;
	this.options = options || {};
	this.url = null;
	this.request = null;
	this.buffer = '';
	return this;
}

// The parser emits events!
Parser.prototype = Object.create(EventEmitter.prototype);

Parser.END        = '\r\n';
Parser.END_LENGTH = 2;

module.exports = Parser;

function destroyer() {
	if(!this.request) return;
	// FIXME: should we emit end/close on explicit destroy?
	if ( typeof this.request.abort === 'function' )
		this.request.abort(); // node v0.4.0
	else
		this.request.socket.destroy();
}

Parser.prototype.connect = function(url, key, secret, params) {
	this.url = url;

	var request = this.oauth.post(url, key, secret, params);

	request.on('response', onResponse.bind(this));
	request.on('error', onError.bind(this));

	this.request = request;
	this.destroy = destroyer.bind(this);

	request.end();
};

function onError(response) {
	this.emit('error', error);
}

function onResponse(response) {
	var parser = this;
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
		parser.receive(chunk);
	});

	response.on('error', function(error) {
		parser.emit('error', error);
	});

	response.on('end', function() {
		parser.emit('end', response);
	});
}

Parser.prototype.receive = function receive(buffer) {
	var index, json, chunk;
	chunk = buffer.toString('utf8');

	this.buffer += chunk;

	// We have END?
	while ((index = this.buffer.indexOf(Parser.END)) > -1) {
		json = this.buffer.slice(0, index);
		this.buffer = this.buffer.slice(index + Parser.END_LENGTH);
		if (json.length > 0) {
			try {
				json = JSON.parse(json);
				switch(json.event){
					case 'follow':
						this.emit('follow', json);
						break;
					case 'favorite':
						this.emit('favorite', json);
						break;
					case 'unfavorite':
						this.emit('unfavorite', json);
						break;
					case 'block':
						this.emit('block', json);
						break;
					case 'unblock':
						this.emit('unblock', json);
						break;
					case 'list_created':
						this.emit('list_created', json);
						break;
					case 'list_destroyed':
						this.emit('list_destroyed', json);
						break;
					case 'list_updated':
						this.emit('list_updated', json);
						break;
					case 'list_member_added':
						this.emit('list_member_added', json);
						break;
					case 'list_member_removed':
						this.emit('list_member_removed', json);
						break;
					case 'list_user_subscribed':
						this.emit('list_user_subscribed', json);
						break;
					case 'list_user_unsubscribed':
						this.emit('list_user_unsubscribed', json);
						break;
					case 'user_update':
						this.emit('user_update', json);
						break;
					default:
						this.emit('data', json);
						break;
				}
			} catch (error) {
				if(chunk === json + Parser.END) {
					this.emit('error', json); // Api Error returned by Twitter
				} else {
					this.emit('error', error); // General parsing error
				}
			}
		} else {
			this.emit('heartbeat');
			this.buffer = '';
		}
	}
};
