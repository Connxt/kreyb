angular.module("kreyb.controllers", [])

.controller("RestaurantListController", function ($scope, $ionicLoading, $ionicContentBanner, $ionicFilterBar, Restaurants, Presence) {
	var contentBannerInstance, filterBarInstance;


	$ionicLoading.show({
		templateUrl: "templates/loading.html",
		noBackdrop: true
	});

	$scope.restaurants = Restaurants.getAll();

	$scope.restaurants.$loaded(function (data) {
		$ionicLoading.hide();
	}, function () {
		$ionicLoading.hide();
	});
	
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
				if(filterText) {
					console.log(filterText);
				}
			}
		});
	};
})

.controller("RestaurantDetailController", function ($scope, $stateParams, Restaurants) {
	$scope.restaurant = Restaurants.get($stateParams.restaurantId);
	$scope.lastDivider = "";

	$scope.isDividerDifferent = function (category) {
		if($scope.lastDivider != category) {
			$scope.lastDivider = category;
			return true;
		}

		return false;
	};

	$scope.dividerFunction = function (key) {
		return key;
	}
});