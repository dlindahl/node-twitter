/*
 * CONVENIENCE FUNCTIONS (not API stable!)
 */

function geoSearch(params, callback) {
	var url = '/geo/search.json';
	this.get(url, params, callback);
	return this;
}

function geoSimilarPlaces(lat, lng, name, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	} else if (typeof params !== 'object') {
		params = {};
	}

	if (typeof lat !== 'number' || typeof lng !== 'number' || !name) {
		callback(new Error('FAIL: You must specify latitude, longitude (as numbers) and name.'));
	}

	var url = '/geo/similar_places.json';
	params.lat = lat;
	params.long = lng;
	params.name = name;
	this.get(url, params, callback);
	return this;
}

function geoReverseGeocode(lat, lng, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	} else if (typeof params !== 'object') {
		params = {};
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		callback(new Error('FAIL: You must specify latitude and longitude as numbers.'));
	}

	var url = '/geo/reverse_geocode.json';
	params.lat = lat;
	params.long = lng;
	this.get(url, params, callback);
	return this;
}

function geoGetPlace(place_id, callback) {
	var url = '/geo/id/' + escape(place_id) + '.json';
	this.get(url, callback);
	return this;
}

module.exports = {
	geoSearch: geoSearch,
	geoSimilarPlaces: geoSimilarPlaces,
	geoReverseGeocode: geoReverseGeocode,
  geoGetPlace: geoGetPlace
};