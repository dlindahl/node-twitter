var merge = require('../../merge');

/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

// FIXME: Uses deprecated Twitter lists API
function getListSubscribers(screen_name, list_id, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var url = '/' + escape(screen_name) + '/' + escape(list_id) + '/subscribers.json';
	params = merge(params, {key:'users'});
	this._getUsingCursor(url, params, callback);
	return this;
}

// FIXME: the rest of list subscribers

module.exports = {
	getListSubscribers: getListSubscribers
};