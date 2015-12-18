angular.module("kreyb.services", [])

.factory("FirebaseRef", function (API_URL) {
	return new Firebase(API_URL);
})

.factory("Restaurants", function ($firebaseArray, FirebaseRef) {
	var ref = FirebaseRef.child("restaurants"),
		restaurants = $firebaseArray(ref);

	return {
		getAll: function () {
			return restaurants;
		},
		get: function (restaurantId) {
			return restaurants.$getRecord(restaurantId);
		},
		add: function (name) {
			restaurants.$add({
				name: name,
				address: "sample address",
				contactInfo: "contact info",
				photo: "image/png;base64,iVBORw0KGgoAAAANSUhEUgAACgAAAAZACAYAAAC1rBvAAAAgAElEQ…ABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIDAUCiiDWUkSl8B8AAAAASUVORK5CYII=",
				menu: []
			});
		}
	}
})

// .factory("Connectivity", function ($cordovaNetwork) {
// 	return {
// 		isOnline: function () {
// 			if(ionic.Platform.isWebView()) {
// 				return $cordovaNetwork.isOnline();
// 			}
// 			else {
// 				return navigator.onLine;
// 			}
// 		}
// 	};
// });