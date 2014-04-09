var merge = require('../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function showStatus(id, callback) {
	var url = '/statuses/show/' + escape(id) + '.json';
	this.get(url, null, callback);
	return this;
}

function updateStatus(text, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/statuses/update.json';
	var defaults = {
		status: text,
		include_entities: 1
	};
	params = merge(defaults, params);
	this.post(url, params, null, callback);
	return this;
}

function destroyStatus(id, callback) {
	var url = '/statuses/destroy/' + escape(id) + '.json';
	this.post(url, null, null, callback);
	return this;
}

function retweetStatus(id, callback) {
	var url = '/statuses/retweet/' + escape(id) + '.json';
	this.post(url, null, null, callback);
	return this;
}

function getRetweets(id, params, callback) {
	var url = '/statuses/retweets/' + escape(id) + '.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetedBy(id, params, callback) {
	var url = '/statuses/' + escape(id) + '/retweeted_by.json';
	this.post(url, params, null, callback);
	return this;
}

function getRetweetedByIds(id, params, callback) {
	var url = '/statuses/' + escape(id) + '/retweeted_by/ids.json';
	this.post(url, params, null, callback);
	return this;
}

module.exports = {
	showStatus: showStatus,
	getStatus: showStatus,
	updateStatus: updateStatus,
	destroyStatus: destroyStatus,
	deleteStatus: destroyStatus,
	retweetStatus: retweetStatus,
	getRetweets: getRetweets,
	getRetweetedBy: getRetweetedBy,
	getRetweetedByIds: getRetweetedByIds
};