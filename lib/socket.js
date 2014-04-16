var EventEmitter = require('events').EventEmitter;
var Parser = require('./parser');

function Socket(oauth, url, key, secret, params) {
	EventEmitter.call(this);
	this.parser = new Parser();
	this.oauth = oauth;
	this.url = url;
	this.key = key;
	this.secret = secret;
	this.params = params;

	var socket = this;
	this.parser.on('error', onError.bind(this));
	this.parser.on('data', function(data) {
		socket.emit('data', socket, data);
	});
}
Socket.prototype = Object.create(EventEmitter.prototype);

function onError(error) {
	this.emit('error', this, error);
}

function onResponse(response) {
	var socket = this;
	// FIXME: Somehow provide chunks of the response when the stream is connected
	// Pass HTTP response data to the parser, which raises events on the stream
	response.on('data', function(data) {
		socket.parser.receive(data);
	});
	response.on('error', onError.bind(this));
	socket.emit('connected', socket);
}

function destroyer() {
	if(!this.request) return;
	// FIXME: should we emit end/close on explicit destroy?
	if ( typeof this.request.abort === 'function' )
		this.request.abort(); // node v0.4.0
	else
		this.request.socket.destroy();

	this.request.removeAllListeners();
	this.request = null;
}

// A connect function that is bound to each unique instance of the Parser
// It handles binding to request events and creates a destroy function, also
// bound the each unique instance of the Parser
function connector() {
	var request = this.oauth.post(this.url, this.key, this.secret, this.params);
	request.on('response', onResponse.bind(this));
	request.on('error', onError.bind(this));

	this.request = request;
	this.destroy = destroyer.bind(this);

	request.end();

	return this;
}

Socket.prototype.open = function open() {
	this._connector = connector.bind(this);
	return this._connector();
};

Socket.prototype.close = function close() {
	this.destroy();
	this.emit('close');
};

module.exports = Socket;