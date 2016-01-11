(function () {
	angular.module("kreyb.services", [])

	.factory("FirebaseRef", function (API_URL) {
		return new Firebase(API_URL);
	})

	.factory("Restaurants", function ($q, $ionicPlatform, OnlineData, OfflineData) {
		var deferred = $q.defer();

		// if(OfflineData.getAll().length >= 1) {
		// 	deferred.resolve(OfflineData.getAll());
		// }
		// else {
		// 	OnlineData.getAll().$loaded(function (data) {
		// 		OfflineData.save(data);
		// 		deferred.resolve(OfflineData.getAll());
		// 	});
		// }
		
		$ionicPlatform.ready(function () {
			OfflineData.getAll().then(function (restaurants) {
				if(restaurants.length >= 1) {
					deferred.resolve(restaurants);
				}
				else {
					OnlineData.getAll().$loaded(function (data) {
						OfflineData.save(data).then(function (isSaved) {
							if(isSaved) {
								OfflineData.getAll().then(function (restaurants) {
									deferred.resolve(restaurants);
								});

								OnlineData.disconnect();
							}
						});
					});
				}
			});
		});

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
			},
			disconnect: function () {
				FirebaseRef.goOffline();
			}
		};
	})

	.factory("OfflineData", function ($q, $ionicPlatform, $cordovaSQLite, OFFLINE_KEY) {
		var db;

		$ionicPlatform.ready(function () {
			if(window.cordova) {
				db = $cordovaSQLite.openDB({ name: "kreyb.db", androidDatabaseImplementation: 2, androidLockWorkaround: 1});
			}
			else {
				db = window.openDatabase("kreyb.db", "1.0", "kreyb database", 2 * 1024 * 1024);				
			}

			db.transaction(function (sqlite) {
				// sqlite.executeSql("DROP TABLE restaurants");
				// sqlite.executeSql("DROP TABLE offerings");
				sqlite.executeSql("CREATE TABLE IF NOT EXISTS restaurants (id text primary key, name text, description text, address text, contactInfo text, photo text, coverPhoto text)");
				sqlite.executeSql("CREATE TABLE IF NOT EXISTS offerings (id text primary key, restaurantId text, name text, description text, price text, category text, photo text)");
			});
		});

		// var restaurants = window.localStorage[OFFLINE_KEY];

		return {
			save: function (data) {
				// window.localStorage[OFFLINE_KEY] = angular.toJson(data);
				// restaurants = angular.toJson(data);
				
				var deferred = $q.defer();

				var restaurantsSQL = "INSERT INTO 'restaurants' ";
				for(var i = 0; i < data.length; i++) {
					if(i == 0) {
						restaurantsSQL += "SELECT " +
							"'" + data[i].$id + "' AS 'id', " +
							"'" + data[i].name + "' AS 'name', " +
							"'" + data[i].description + "' AS 'description', " +
							"'" + data[i].address + "' AS 'address', " +
							"'" + data[i].contactInfo + "' AS 'contactInfo', " +
							"'" + data[i].photo + "' AS 'photo', " +
							"'" + data[i].coverPhoto + "' AS 'coverPhoto' ";
					}
					else {
						restaurantsSQL += "UNION ALL SELECT " +
							"'" + data[i].$id + "', " +
							"'" + data[i].name + "', " +
							"'" + data[i].description + "', " +
							"'" + data[i].address + "', " +
							"'" + data[i].contactInfo + "', " +
							"'" + data[i].photo + "', " +
							"'" + data[i].coverPhoto + "' ";
					}
				}

				var offeringsSQL = "INSERT INTO 'offerings' ";
				for(var i = 0; i < data.length; i++) {
					for(var j = 0; j < data[i].offerings.length; j++) {
						if(i == 0 && j == 0) {
							offeringsSQL += "SELECT " +
								"'" + data[i].$id + j + "' AS 'id', " +
								"'" + data[i].$id + "' AS 'restaurantId', " +
								"'" + data[i].offerings[j].name + "' AS 'name', " +
								"'" + data[i].offerings[j].description + "' AS 'description', " +
								"'" + data[i].offerings[j].price + "' AS 'price', " +
								"'" + data[i].offerings[j].category + "' AS 'category', " +
								"'" + data[i].offerings[j].photo + "' AS 'photo' ";
						}
						else {
							offeringsSQL += "UNION ALL SELECT " +
								"'" + data[i].$id + j + "', " +
								"'" + data[i].$id + "', " +
								"'" + data[i].offerings[j].name + "', " +
								"'" + data[i].offerings[j].description + "', " +
								"'" + data[i].offerings[j].price + "', " +
								"'" + data[i].offerings[j].category + "', " +
								"'" + data[i].offerings[j].photo + "' ";
						}
					}
				}

				db.transaction(function (sqlite) {
					sqlite.executeSql(restaurantsSQL, [], function (sqlite) {
						sqlite.executeSql(offeringsSQL, [], function (sqlite) {
							deferred.resolve(true);
						});
					});
				});

				return deferred.promise;
			},
			getAll: function () {
				// if(restaurants) {
				// 	restaurants = angular.fromJson(restaurants);
				// }
				// else {
				// 	restaurants = [];
				// }

				// return restaurants;
				
				var deferred = $q.defer();

				db.transaction(function (sqlite) {
					sqlite.executeSql("SELECT * FROM restaurants", [], function (sqlite, results) {
						var restaurants = [];
						for(var i = 0; i < results.rows.length; i++) {
							restaurants.push(results.rows.item(i));
						}
						deferred.resolve(restaurants);
					});
				});

				return deferred.promise;
			},
			get: function (restaurantId) {
				// var restaurant = {};
				
				// if(restaurants) {
				// 	for(var i = 0; i < restaurants.length; i++) {
				// 		if(restaurants[i].$id == restaurantId) {
				// 			restaurant = restaurants[i];
				// 			break;
				// 		}
				// 	}
				// }

				// return restaurant;
				
				var deferred = $q.defer(),
					restaurant = {};

				db.transaction(function (sqlite) {
					sqlite.executeSql("SELECT * FROM restaurants WHERE id='" + restaurantId + "'", [], function (sqlite, results) {
						restaurant = results.rows.item(0);

						sqlite.executeSql("SELECT * FROM offerings WHERE restaurantId='" + restaurantId + "'", [], function (sqlite, results) {
							var offerings = [];
							for(var i = 0; i < results.rows.length; i++) {
								offerings.push(results.rows.item(i));
							}
							restaurant.offerings = offerings;
							deferred.resolve(restaurant);
						});
					});
				});

				return deferred.promise;
			}
		};
	})
})();