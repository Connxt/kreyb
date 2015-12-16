angular.module("kreyb.controllers", [])

.controller("RestaurantListController", function ($scope, $ionicContentBanner, $ionicFilterBar, Restaurants, Presence) {
	var contentBannerInstance, filterBarInstance;

	$scope.restaurants = Restaurants.getAll();

	$scope.loadRestaurants = function () {
		$scope.restaurants = Restaurants.getAll();
		
		if(contentBannerInstance) {
			contentBannerInstance();
			contentBannerInstance = null;
		}

		if(filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}

		console.log(Presence.$value);

		if(Presence.$value) {
			$scope.$broadcast("scroll.refreshComplete");
			contentBannerInstance = $ionicContentBanner.show({
				text: ["You're already up to date."],
				interval: 3000,
				autoClose: 3000,
				type: "info",
				transition: "vertical"
			});
		}
		else {
			$scope.$broadcast("scroll.refreshComplete");
			contentBannerInstance = $ionicContentBanner.show({
				text: ["System Unavailable", "Please try again later."],
				interval: 3000,
				autoClose: 3000,
				type: "error",
				transition: "vertical"
			});
		}

		// $scope.restaurants.$loaded(function (data) {
			// $scope.$broadcast("scroll.refreshComplete");
			// contentBannerInstance = $ionicContentBanner.show({
			// 	text: ["You're already up to date."],
			// 	interval: 3000,
			// 	autoClose: 3000,
			// 	type: "info",
			// 	transition: "vertical"
			// });
		// }, function () {
			// $scope.$broadcast("scroll.refreshComplete");
			// contentBannerInstance = $ionicContentBanner.show({
			// 	text: ["System Unavailable", "Please try again later."],
			// 	interval: 3000,
			// 	autoClose: 3000,
			// 	type: "error",
			// 	transition: "vertical"
			// });
		// });
	};

	$scope.showFilterBar = function () {
		filterBarInstance = $ionicFilterBar.show({
			items: $scope.restaurants,
			update: function (filteredItems, filterText) {
				$scope.restaurants = filteredItems;
			}
		});
	};
})

.controller("RestaurantDetailController", function ($scope, $stateParams, Restaurants) {
	// $scope.restaurant = Restaurants.$getRecord($stateParams.restaurantId);
	$scope.restaurant = Restaurants.get($stateParams.restaurantId);
});