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

	this.request.removeAllListeners();
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
        this.emit('data', json);
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
