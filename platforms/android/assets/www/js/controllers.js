angular.module("kreyb.controllers", [])

.controller("RestaurantListController", function ($scope, $ionicLoading, $ionicContentBanner, $ionicFilterBar, Restaurants, MAX_LOADING_TIME) {
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

	$scope.noResults = false;

	var initialLoading = function () {
		var loadTime = 0,
			loadingChecker;

		if(contentBannerInstance) {
			contentBannerInstance();
			contentBannerInstance = null;
		}

		$ionicLoading.show({ templateUrl: "templates/loading.html" });

		$scope.restaurants = Restaurants.getAll();

		// if(!Connectivity.isOnline()) {
		// 	$scope.noResults = true;
		// 	$ionicLoading.hide();
		// 	contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
		// }
		// else {
		// 	$scope.restaurants.$loaded(function (data) {
		// 		clearInterval(loadingChecker);
		// 		$ionicLoading.hide();
		// 		contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
		// 	});

		// 	loadingChecker = setInterval(function () {
		// 		loadTime += 1000;

		// 		if(!Connectivity.isOnline() || loadTime >= MAX_LOADING_TIME) {
		// 			$scope.noResults = true;
		// 			clearInterval(loadingChecker);
		// 			$ionicLoading.hide();
		// 			contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
		// 		}
		// 	}, 1000);
		// }
		
		$scope.restaurants.$loaded(function (data) {
			clearInterval(loadingChecker);
			$ionicLoading.hide();
			contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
		});

		loadingChecker = setInterval(function () {
			loadTime += 1000;

			if(loadTime >= MAX_LOADING_TIME) {
				$scope.noResults = true;
				clearInterval(loadingChecker);
				$ionicLoading.hide();
				contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
			}
		}, 1000);
	}();

	$scope.reload = function () {
		var loadTime = 0,
			loadingChecker;

		if(contentBannerInstance) {
			contentBannerInstance();
			contentBannerInstance = null;
		}

		$scope.restaurants = Restaurants.getAll();

		// if(!Connectivity.isOnline()) {
		// 	$scope.noResults = true;
		// 	$scope.$broadcast("scroll.refreshComplete");
		// 	contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
		// }
		// else {
		// 	$scope.restaurants.$loaded(function (data) {
		// 		$scope.noResults = false;
		// 		clearInterval(loadingChecker);
		// 		$scope.$broadcast("scroll.refreshComplete");
		// 		contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
		// 	});

		// 	loadingChecker = setInterval(function () {
		// 		loadTime += 1000;

		// 		if(!Connectivity.isOnline() || loadTime >= MAX_LOADING_TIME) {
		// 			$scope.noResults = true;
		// 			clearInterval(loadingChecker);
		// 			$scope.$broadcast("scroll.refreshComplete");
		// 			contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
		// 		}
		// 	}, 1000);
		// }
		$scope.restaurants.$loaded(function (data) {
			$scope.noResults = false;
			clearInterval(loadingChecker);
			$scope.$broadcast("scroll.refreshComplete");
			contentBannerInstance = $ionicContentBanner.show(successContentBannerOptions);
		});

		loadingChecker = setInterval(function () {
			loadTime += 1000;

			if(loadTime >= MAX_LOADING_TIME) {
				$scope.noResults = true;
				clearInterval(loadingChecker);
				$scope.$broadcast("scroll.refreshComplete");
				contentBannerInstance = $ionicContentBanner.show(failedContentBannerOptions);
			}
		}, 1000);
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

.controller("RestaurantDetailController", function ($scope, $stateParams, $ionicModal, $ionicSlideBoxDelegate, Restaurants) {
	$scope.restaurant = Restaurants.get($stateParams.restaurantId);
	
	$scope.dividerFunction = function (key) {
		return key;
	};

	$ionicModal.fromTemplateUrl("templates/restaurant-list/viewer.html", {
		scope: $scope,
		animation: "slide-in-up"
	}).then(function (modal) {
		$scope.modal = modal;
	});

	$scope.openViewer = function (index) {
		$ionicSlideBoxDelegate.slide(index);
		$scope.modal.show();
	};

	$scope.closeViewer = function () {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.slideChanged = function (index) {
		$scope.slideIndex = index;
	};
});