var STALL_TIMEOUT = 30.75 * 1000;

function StallMonitor() {
	this.socket = null;
}

function onHeartbeat() {
	resetBreaker(this);
}

function onBreakerTripped(monitor) {
	monitor.socket.reopen();
}

function resetBreaker(monitor) {
	clearTimeout(monitor.breaker);

	monitor.breaker = setTimeout(onBreakerTripped.bind(null, monitor), STALL_TIMEOUT);

	return monitor;
}

function watch(socket) {
	this.socket = socket;

	socket.on('open', resetBreaker.bind(null, this));
	socket.parser.on('heartbeat', onHeartbeat.bind(this));
	socket.on('reopen', this.unwatch.bind(this));
	socket.on('close', this.unwatch.bind(this));

	return this;
}

function unwatch() {
	// console.log('#unwatch (kill everything)');
	var socket = this.socket;
	if(this.breaker) clearTimeout(this.breaker);

	// socket.parser.removeListener('heartbeat', onHeartbeat);
	// socket.parser.removeListener('end', this.unwatch);
}

StallMonitor.watch = function watch(parser) {
	var monitor = new StallMonitor().watch(parser);

	return monitor;
};

StallMonitor.prototype = {
	watch: watch,
	unwatch: unwatch
};

module.exports = StallMonitor;