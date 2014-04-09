/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function savedSearches(callback) {
	var url = '/saved_searches.json';
	this.get(url, null, callback);
	return this;
}

function showSavedSearch(id, callback) {
	var url = '/saved_searches/' + escape(id) + '.json';
	this.get(url, null, callback);
	return this;
}

function createSavedSearch(query, callback) {
	var url = '/saved_searches/create.json';
	this.post(url, {query: query}, null, callback);
	return this;
}

function destroySavedSearch(id, callback) {
	var url = '/saved_searches/destroy/' + escape(id) + '.json?_method=DELETE';
	this.post(url, null, null, callback);
	return this;
}

module.exports = {
	savedSearches: savedSearches,
	showSavedSearch: showSavedSearch,
	createSavedSearch: createSavedSearch,
	newSavedSearch: createSavedSearch,
	destroySavedSearch: destroySavedSearch,
  deleteSavedSearch: destroySavedSearch
};