var debounce = require('debounce');
var EventEmitter = require('events').EventEmitter;

function Parser(oauth, options) {
	EventEmitter.call(this);
	this.buffer = '';
}

Parser.prototype = Object.create(EventEmitter.prototype);

Parser.END        = '\r\n';
Parser.END_LENGTH = 2;

module.exports = Parser;

var heartbeat = debounce(function(scope) {
	scope.emit('heartbeat');
}, 2000, true);

Parser.prototype.receive = function receive(buffer) {
	var index, json, chunk;
	chunk = buffer.toString('utf8');

	this.buffer += chunk;

	while ((index = this.buffer.indexOf(Parser.END)) > -1) {
		json = this.buffer.slice(0, index);

		this.buffer = this.buffer.slice(index + Parser.END_LENGTH);
		if (json.length > 0) {
			try {
				json = JSON.parse(json);
				this.emit('data', json);
			} catch (error) {
				if(chunk === json + Parser.END) {
					this.emit('apierror', new Error(json)); // Api Error returned by Twitter
				} else {
					this.emit('error', error); // General parsing error
				}
			}
		} else {
			heartbeat(this);
			this.buffer = '';
		}
	}
};
