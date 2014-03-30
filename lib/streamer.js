// glorious stream response parser, built specifically for the twitter streaming api
// assumptions:
//   1) ninjas are mammals
//   2) tweets come in chunks of text
//   3) only one tweet per chunk
//
//   p = new streamer(request)
//   p.addListener('object', function...)
//   ...

var EventEmitter = require('events').EventEmitter;

// FIXME: Somehow provide chunks of the response when the stream is connected
// Pass HTTP response data to the parser, which raises events on the stream
function responseHandler(response) {
	var self = this;
	response.on('readable', function() {
		var json;
		var chunk;
		while (null !== (chunk = response.read())) {
			var data = chunk.toString('utf8');

			if (data.length > 0) {
				try {
					json = JSON.parse(data);
					self.emit('data', json);
					if(json.event) self.emit(json.event, json);
				} catch (error) {
					self.emit('error', error);
				}
			}
		}
	});
}

function errorHandler(error) {
	this.emit('error', error);
}

function endHandler(error) {
	this.emit('end', error);
}

function closeHandler(error) {
	this.emit('close', error);
}

function requestBinder(streamer, request) {
	request.on('response', responseHandler.bind(streamer));
	request.on('error', errorHandler.bind(streamer));
	request.on('end', endHandler.bind(streamer));
	request.on('close', closeHandler.bind(streamer));
}

function destroyer(request) {
	return function() {
		// FIXME: should we emit end/close on explicit destroy?
		if( typeof request.abort === 'function' ) {
			request.abort(); // node v0.4.0
		} else {
			request.socket.destroy();
		}
	};
}

function Streamer(request) {
	// Make sure we call our parents constructor
	EventEmitter.call(this);
	requestBinder(this, request);
	this.destroy = destroyer(request);
	return this;
}

// The parser emits events!
Streamer.prototype = Object.create(EventEmitter.prototype);

module.exports = Streamer;