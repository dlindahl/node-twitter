var merge = require('../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getDirectMessages(params, callback) {
	var url = '/direct_messages.json';
	this.get(url, params, callback);
	return this;
}

function getDirectMessagesSent(params, callback) {
	var url = '/direct_messages/sent.json';
	this.get(url, params, callback);
	return this;
}

function newDirectMessage(id, text, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var defaults = {
		text: text,
		include_entities: 1
	};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		defaults.screen_name = id;
	else
		defaults.user_id = id;
	params = merge(defaults, params);

	var url = '/direct_messages/new.json';
	this.post(url, params, null, callback);
	return this;
}

function destroyDirectMessage(id, callback) {
	var url = '/direct_messages/destroy/' + escape(id) + '.json?_method=DELETE';
	this.post(url, null, callback);
	return this;
}

module.exports = {
	getDirectMessages: getDirectMessages,
	getDirectMessagesSent: getDirectMessagesSent,
	getSentDirectMessages: getDirectMessagesSent,
	newDirectMessage: newDirectMessage,
	updateDirectMessage: newDirectMessage,
	sendDirectMessage: newDirectMessage,
	destroyDirectMessage: destroyDirectMessage,
	deleteDirectMessage: destroyDirectMessage
}