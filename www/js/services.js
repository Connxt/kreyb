angular.module("kreyb.services", [])

.factory("FirebaseRef", function (API_URL) {
	return new Firebase(API_URL);
})

.factory("Presence", function ($firebaseObject, FirebaseRef) {
	// return FirebaseRef.child(".info/connected");
	return $firebaseObject(FirebaseRef.child(".info/connected"));
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
				menu: []
			});
		}
	}
});