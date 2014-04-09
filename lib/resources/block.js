/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function createBlock(id, callback) {
	var url = '/blocks/create.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.post(url, params, null, callback);
	return this;
}

function destroyBlock(id, callback) {
	var url = '/blocks/destroy.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.post(url, params, null, callback);
	return this;
}

function blockExists(id, callback) {
	var url = '/blocks/exists.json';

	var params = {};
	if (typeof id === 'object') {
		params = id;
	}
	else if (typeof id === 'string')
		params.screen_name = id;
	else
		params.user_id = id;

	this.get(url, params, null, callback);
	return this;
}

// FIXME: blocking section not complete (blocks/blocking + blocks/blocking/ids)

module.exports = {
	createBlock: createBlock,
	blockUser: createBlock,
	destroyBlock: destroyBlock,
	unblockUser: destroyBlock,
	blockExists: blockExists,
	isBlocked: blockExists
};