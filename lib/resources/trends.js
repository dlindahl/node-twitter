/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getTrends(callback) {
	var url = '/trends.json';
	this.get(url, null, callback);
	return this;
}

function getCurrentTrends(params, callback) {
	var url = '/trends/current.json';
	this.get(url, params, callback);
	return this;
}

function getDailyTrends(params, callback) {
	var url = '/trends/daily.json';
	this.get(url, params, callback);
	return this;
}

function getWeeklyTrends(params, callback) {
	var url = '/trends/weekly.json';
	this.get(url, params, callback);
	return this;
}

module.exports = {
	getTrends: getTrends,
	getCurrentTrends: getCurrentTrends,
	getDailyTrends: getDailyTrends,
	getWeeklyTrends: getWeeklyTrends
};