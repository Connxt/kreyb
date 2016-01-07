angular.module("kreyb.controllers", [])

.controller("RestaurantListController", function ($scope, $ionicLoading, $ionicContentBanner, $ionicFilterBar, Restaurants, Presence) {
	var contentBannerInstance,
		filterBarInstance,
		successContentBannerOptions = {
			text: ["You're already up to date."],
			interval: 3000,
			autoClose: 3000,
			type: "info",
			transition: "vertical"
		},
		failedContentBannerOptions = {
			text: ["System Unavailable", "Please try again later."],
			interval: 3000,
			autoClose: 3000,
			type: "error",
			transition: "vertical"
		};

	console.log(navigator);

	var initialLoading = function () {
		var initLoadTime = 0,
			initLoadingRunner;

		if(contentBannerInstance) {
			contentBannerInstance();
			contentBannerInstance = null;
		}

		$ionicLoading.show({
			templateUrl: "templates/loading.html",
			noBackdrop: true
		});

		$scope.restaurants = Restaurants.getAll();

		$scope.restaurants.$loaded(function (data) {
			$ionicLoading.hide();
			contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
		}, function () {
			$ionicLoading.hide();
			contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
		});
	}();
	
	// $scope.loadRestaurants = function () {
	// 	$scope.restaurants = Restaurants.getAll();

	// 	if(contentBannerInstance) {
	// 		contentBannerInstance();
	// 		contentBannerInstance = null;
	// 	}

	// 	if(filterBarInstance) {
	// 		filterBarInstance();
	// 		filterBarInstance = null;
	// 	}

	// 	console.log(Presence.$value);

	// 	if(Presence.$value) {
	// 		$scope.$broadcast("scroll.refreshComplete");
	// 		contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
	// 	}
	// 	else {
	// 		$scope.$broadcast("scroll.refreshComplete");
	// 		contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
	// 	}
	// };

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
	
	$scope.dividerFunction = function (key) {
		return key;
	}
});