var merge = require('../../merge'),
  util = require('../../util');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getLists(id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var defaults = {key:'lists'};

	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		defaults.screen_name = id;
	else
		defaults.user_id = id;

	params = merge(defaults, params);
console.log(params);
	var url = '/lists.json';
	util.getUsingCursor(this, url, params, callback);
	return this;
}

function getListMemberships(id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var defaults = {key:'lists'};

	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		defaults.screen_name = id;
	else
		defaults.user_id = id;
	params = merge(defaults, params);

	var url = '/lists/memberships.json';
	util.getUsingCursor(this, url, params, callback);
	return this;
}

function getListSubscriptions(id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var defaults = {key:'lists'};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		defaults.screen_name = id;
	else
		defaults.user_id = id;
	params = merge(defaults, params);

	var url = '/lists/subscriptions.json';
	util.getUsingCursor(this, url, params, callback);
	return this;
}

// FIXME: Uses deprecated Twitter lists API
function showList(screen_name, list_id, callback) {
	var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json';
	this.get(url, null, callback);
	return this;
}

// FIXME: Uses deprecated Twitter lists API
function getListTimeline(screen_name, list_id, params, callback) {
	var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '/statuses.json';
	this.get(url, params, callback);
	return this;
}

// FIXME: Uses deprecated Twitter lists API
function createList(screen_name, list_name, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/' + escape(screen_name) + '/lists.json';
	params = merge(params, {name:list_name});
	this.post(url, params, null, callback);
	return this;
}

// FIXME: Uses deprecated Twitter lists API
function updateList(screen_name, list_id, params, callback) {
	var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json';
	this.post(url, params, null, callback);
	return this;
}

// FIXME: Uses deprecated Twitter lists API
function deleteList(screen_name, list_id, callback) {
	var url = '/' + escape(screen_name) + '/lists/' + escape(list_id) + '.json?_method=DELETE';
	this.post(url, null, callback);
	return this;
}

module.exports = {
	getLists: getLists,
	getListMemberships: getListMemberships,
	getListSubscriptions: getListSubscriptions,
	showList: showList,
	getListTimeline: getListTimeline,
	showListStatuses: getListTimeline,
	createList: createList,
	updateList: updateList,
	deleteList: deleteList,
	destroyList: deleteList
};