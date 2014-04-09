var merge = require('../merge'),
  util = require('../util');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function createFriendship(id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var defaults = {
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

	var url = '/friendships/create.json';
	this.post(url, params, null, callback);
	return this;
}

function destroyFriendship(id, callback) {
	if (typeof id === 'function') {
		callback = id;
		id = null;
	}

	var params = {
		include_entities: 1
	};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	var url = '/friendships/destroy.json?_method=DELETE';
	this.post(url, params, null, callback);
	return this;
}

// Only exposing friendships/show instead of friendships/exist

function showFriendship(source, target, callback) {
	var params = {};

	if (typeof source === 'object') {
		for(var source_property in source) {
			params[source_property] = source[source_property];
		}
	}
	else if (typeof source === 'string')
		params.source_screen_name = source;
	else
		params.source_id = source;

	if (typeof target === 'object') {
		for(var target_property in target) {
			params[target_property] = target[target_property];
		}
	}
	else if (typeof target === 'string')
		params.target_screen_name = target;
	else
		params.target_id = target;

	var url = '/friendships/show.json';
	this.get(url, params, callback);
	return this;
}

function incomingFriendship(callback) {
	var url = '/friendships/incoming.json';
	util.getUsingCursor(this, url, {key:'ids'}, callback);
	return this;
}

function outgoingFriendship(callback) {
	var url = '/friendships/outgoing.json';
	util.getUsingCursor(this, url, {key:'ids'}, callback);
	return this;
}

module.exports = {
	createFriendship: createFriendship,
	destroyFriendship: destroyFriendship,
	deleteFriendship: destroyFriendship,
	showFriendship: showFriendship,
	incomingFriendship: incomingFriendship,
	incomingFriendships: incomingFriendship,
	outgoingFriendship: outgoingFriendship,
	outgoingFriendships: outgoingFriendship
};