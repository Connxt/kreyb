angular.module("kreyb.controllers", [])

.controller("RestaurantListController", function ($scope, Restaurants) {
	$scope.restaurants = Restaurants.getAll();

	$scope.addRestaurant = function () {
		var restaurantName = prompt("What is the name of the restaurant you want to add?");

		if(restaurantName) {
			// $scope.restaurants.$add({
			// 	name: restaurantName,
			// 	address: "",
			// 	contactInfo: "",
			// 	menu: []
			// });
		}
	};
})

.controller("RestaurantDetailController", function ($scope, $stateParams, Restaurants) {
	// $scope.restaurant = Restaurants.$getRecord($stateParams.restaurantId);
	$scope.restaurant = Restaurants.get($stateParams.restaurantId);
});