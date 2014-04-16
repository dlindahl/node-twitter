var EventEmitter = require('events').EventEmitter;
var Parser = require('./parser');

function Stream(socket) {
	EventEmitter.call(this);

	var stream = this;
	socket.on('data', function(socket, data) {
		stream.emit('data', data);
	});

	socket.on('error', function(socket, error) {
		stream.emit('error', error);
	});

	socket.on('close', function() {
		stream.emit('end');
		stream.emit('close');
	});
}
Stream.prototype = Object.create(EventEmitter.prototype);


module.exports = Stream;