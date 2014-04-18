var backoff = require('./backoff');
var EventEmitter = require('events').EventEmitter;
var Parser = require('./parser');
var StallMonitor = require('./stall_monitor');

var ENHANCE_YOUR_CALM = 420;

function Socket(oauth, url, key, secret, params) {
	EventEmitter.call(this);
	this.parser = new Parser();
	this.monitor = new StallMonitor();
	this.oauth = oauth;
	this.url = url;
	this.key = key;
	this.secret = secret;
	this.params = params;

	bindToParser(this);

	this.backoff = backoff.create(this);
	this.monitor.watch(this);
}
Socket.prototype = Object.create(EventEmitter.prototype);

Socket.prototype.open = function open() {
	this._connector = createConnector(this);
	return this._connector();
};

Socket.prototype.reopen = function reopen(strategy, error) {
	if(this.backoff.timeoutID_ !== -1) return;
	if(this.request) this.destroy();

	this.emit('reopen', this, strategy, error);

	this.backoff.backoffStrategy_ = strategy || backoff.TCP_STRATEGY;
	this.backoff.backoff();
};

Socket.prototype.close = function close() {
	this.destroy();
	this.emit('close');
};

function bindToParser(socket) {
	socket.parser.on('error', function(error) {
		socket.emit('error', socket, error);
	});
	socket.parser.on('apierror', function(error) {
		socket.reopen(backoff.HTTP_STRATEGY, error);
	});
	socket.parser.on('heartbeat', function() {
		socket.emit('heartbeat');
	});
	socket.parser.on('data', function(data) {
		socket.emit('data', socket, data);
	});
}

function createResponder(socket) {
	return function onResponse(response) {
		socket.backoff.reset();

		// FIXME: Somehow provide chunks of the response when the stream is connected
		// Pass HTTP response data to the parser, which raises events on the stream
		response.on('data', function(data) {
			socket.parser.receive(data);
		});
		response.on('end', function() {
			response.removeAllListeners();
			if(ENHANCE_YOUR_CALM === this.statusCode) {
				socket.reopen(backoff.RATE_LIMIT_STRATEGY, this.body);
			}
		});
		socket.emit('open', socket);
	};
}

function createDestroyer(socket) {
	return function destroyer() {
		if(!socket.request) return;
		// FIXME: should we emit end/close on explicit destroy?
		if( typeof socket.request.abort === 'function' ) {
			socket.request.abort(); // node v0.4.0
		} else {
			socket.request.socket.destroy();
		}

		socket.request.removeAllListeners();
		socket.request = null;
	};
}

// A connect function that is bound to each unique instance of the Parser
// It handles binding to request events and creates a destroy function, also
// bound to the each unique instance of the Parser
function createConnector(socket) {
	var url = socket.url;
	var key = socket.key;
	var secret = socket.secret;
	var params = socket.params;
	return function connector() {
		var request = socket.oauth.post(url, key, secret, params);
		request.on('error', function(err) {
			socket.reopen(backoff.HTTP_STRATEGY, err);
		});
		request.on('response', createResponder(socket));
		request.end();

		socket.request = request;
		socket.destroy = createDestroyer(socket);

		return socket;
	};
}

module.exports = Socket;