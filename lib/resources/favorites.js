/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function getFavorites(params, callback) {
	var url = '/favorites.json';
	this.get(url, params, callback);
	return this;
}

function createFavorite(id, params, callback) {
	var url = '/favorites/create/' + escape(id) + '.json';
	this.post(url, params, null, callback);
	return this;
}

function destroyFavorite(id, params, callback) {
	var url = '/favorites/destroy/' + escape(id) + '.json';
	this.post(url, params, null, callback);
	return this;
}

module.exports = {
	getFavorites: getFavorites,
	createFavorite: createFavorite,
	favoriteStatus: createFavorite,
	destroyFavorite: destroyFavorite,
	deleteFavorite: destroyFavorite
};