var Backoff = require('backoff');

var TCP_STRATEGY = new Backoff.ExponentialStrategy({
	maxDelay: 16 * 1000
});
var HTTP_STRATEGY = new Backoff.ExponentialStrategy({
	initialDelay: 5 * 1000,
	maxDelay: 320 * 1000
});
var RATE_LIMIT_STRATEGY = new Backoff.ExponentialStrategy({
	initialDelay: 60 * 1000,
	maxDelay: 320 * 1000
});

function createBackoff(socket) {
	var backoff = new Backoff.Backoff(TCP_STRATEGY);

	backoff.on('backoff', function(number, delay) {
		socket.emit('backoff', socket, number, delay);
	});

	backoff.on('ready', function() {
		socket._connector();
	});

	return backoff;
}

module.exports = {
	TCP_STRATEGY: TCP_STRATEGY,
	HTTP_STRATEGY: HTTP_STRATEGY,
	RATE_LIMIT_STRATEGY: RATE_LIMIT_STRATEGY,
	create: createBackoff
};