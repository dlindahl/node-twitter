/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function reportSpam(id, callback) {
	var url = '/report_spam.json';

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

module.exports = {
	reportSpam: reportSpam
};