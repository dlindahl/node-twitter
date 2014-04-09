var merge = require('../../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

// FIXME: Uses deprecated Twitter lists API
function getListMembers(screen_name, list_id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/' + escape(screen_name) + '/' + escape(list_id) + '/members.json';
	params = merge(params, {key:'users'});
	this._getUsingCursor(url, params, callback);
	return this;
}

// FIXME: the rest of list members

module.exports = {
	getListMembers: getListMembers
};