/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getHomeTimeline(params, callback) {
	var url = '/statuses/home_timeline.json';
	this.get(url, params, callback);
	return this;
}

function getMentions(params, callback) {
	var url = '/statuses/mentions.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetedByMe(params, callback) {
	var url = '/statuses/retweeted_by_me.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetedToMe(params, callback) {
	var url = '/statuses/retweeted_to_me.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetsOfMe(params, callback) {
	var url = '/statuses/retweets_of_me.json';
	this.get(url, params, callback);
	return this;
}

function getUserTimeline(params, callback) {
	var url = '/statuses/user_timeline.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetedToUser(params, callback) {
	var url = '/statuses/retweeted_to_user.json';
	this.get(url, params, callback);
	return this;
}

function getRetweetedByUser(params, callback) {
	var url = '/statuses/retweeted_by_user.json';
	this.get(url, params, callback);
	return this;
}

module.exports = {
	getHomeTimeline: getHomeTimeline,
	getMentions: getMentions,
	getRetweetedByMe: getRetweetedByMe,
	getRetweetedToMe: getRetweetedToMe,
	getRetweetsOfMe: getRetweetsOfMe,
	getUserTimeline: getUserTimeline,
	getRetweetedToUser: getRetweetedToUser,
	getRetweetedByUser: getRetweetedByUser
};