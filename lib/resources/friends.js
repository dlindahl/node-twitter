var util = require('../util');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getFriendsIds(id, callback) {
	if (typeof id === 'function') {
		callback = id;
		id = null;
	}
	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else if (typeof id === 'number')
		params.user_id = id;

	params.key = 'ids';

	var url = '/friends/ids.json';
	util.getUsingCursor(this, url, params, callback);
	return this;
}

module.exports = {
	getFriendsIds: getFriendsIds
};