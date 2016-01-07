(function () {
	angular.module("kreyb.services", [])

	.factory("FirebaseRef", function (API_URL) {
		return new Firebase(API_URL);
	})

	.factory("Restaurants", function ($q, OnlineData, OfflineData) {
		var deferred = $q.defer();

		if(OfflineData.getAll().length >= 1) {
			deferred.resolve(OfflineData.getAll());
		}
		else {
			OnlineData.getAll().$loaded(function (data) {
				OfflineData.save(data);
				deferred.resolve(OfflineData.getAll());
			});
		}

		return {
			getAll: function () {
				return deferred.promise;
			},
			get: function (restaurantId) {
				return OfflineData.get(restaurantId);
			}
		}
	})

	.factory("OnlineData", function ($firebaseArray, FirebaseRef) {
		var ref = FirebaseRef.child("restaurants"),
			restaurants = $firebaseArray(ref);

		return {
			getAll: function () {
				return restaurants;
			},
			get: function (restaurantId) {
				return restaurants.$getRecord(restaurantId);
			}
		};
	})

	.factory("OfflineData", function (OFFLINE_KEY) {
		var restaurants = window.localStorage[OFFLINE_KEY];

		return {
			save: function (data) {
				window.localStorage[OFFLINE_KEY] = angular.toJson(data);
				restaurants = angular.toJson(data);
			},
			getAll: function () {
				if(restaurants) {
					restaurants = angular.fromJson(restaurants);
				}
				else {
					restaurants = [];
				}

				return restaurants;
			},
			get: function (restaurantId) {
				var restaurant = {};
				
				if(restaurants) {
					for(var i = 0; i < restaurants.length; i++) {
						if(restaurants[i].$id == restaurantId) {
							restaurant = restaurants[i];
							break;
						}
					}
				}

				return restaurant;
			}
		};
	});
})();