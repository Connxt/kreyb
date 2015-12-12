angular.module("kreyb.services", [])

.factory("FirebaseRef", function (API_URL) {
	return new Firebase(API_URL);
})

.factory("Presence", function (FirebaseRef) {
	return FirebaseRef.child(".info/connected");
})

.factory("Items", function ($firebaseArray, FirebaseRef, Presence) {
	var itemsRef = FirebaseRef.child("items");
	return $firebaseArray(itemsRef);
})

.factory("Restaurants", function ($firebaseArray, FirebaseRef) {
	var ref = FirebaseRef.child("restaurants");
	return $firebaseArray(ref);
});