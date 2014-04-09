function getPublicTimeline(params, callback) {
	var url = '/statuses/public_timeline.json';
	this.get(url, params, callback);
	return this;
}

function getFriendsTimeline(params, callback) {
	var url = '/statuses/friends_timeline.json';
	this.get(url, params, callback);
	return this;
}

module.exports = {
	getPublicTimeline: getPublicTimeline,
	getFriendsTimeline: getFriendsTimeline
};