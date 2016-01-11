(function () {
	angular.module("kreyb", [
		"kreyb.controllers",
		"kreyb.services",
		"kreyb.directives",
		"kreyb.filters",
		"ionic",
		"ngResource",
		"ngCordova",
		"firebase",
		"jett.ionic.filter.bar",
		"jett.ionic.content.banner",
		"jett.ionic.scroll.sista",
		"ngIOS9UIWebViewPatch",
		"ion-gallery",
		"ionic.ion.autoListDivider",
		"ion-sticky",
		"ionicLazyLoad"
	])

	.constant("API_URL", "https://kreyb.firebaseio.com/")

	.constant("OFFLINE_KEY", "kreyb.restaurants")

	.constant("MAX_LOADING_TIME", 100000)

	.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
		if(window.cordova) {
			// $ionicConfigProvider.views.transition("none");
			// // then override any default you want
			// window.plugins.nativepagetransitions.globalOptions.duration = 500;
			// window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
			// window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
			// window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
			// window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
			// // these are used for slide left/right only currently
			// window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
			// window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
		}

		$ionicFilterBarConfigProvider.theme("light");
		$ionicFilterBarConfigProvider.clear("ion-close");
		$ionicFilterBarConfigProvider.search("ion-search");
		$ionicFilterBarConfigProvider.backdrop(true);
		$ionicFilterBarConfigProvider.transition("vertical");
		$ionicFilterBarConfigProvider.placeholder("What are you kreybing for?");

		$stateProvider
		.state("app", {
			url: "/app",
			abstract: true,
			templateUrl: "templates/abstract.html"
		})
		.state("app.restaurant-list", {
			url: "/restaurant-list",
			views: {
				"main": {
					templateUrl: "templates/restaurant-list/list.html",
					controller: "RestaurantListController"
				}
			}
		})
		.state("app.restaurant-detail", {
			url: "/restaurant-list/:restaurantId",
			views: {
				"main": {
					templateUrl: "templates/restaurant-list/detail.html",
					controller: "RestaurantDetailController"
				}
			}
		});

		$urlRouterProvider.otherwise("/app/restaurant-list");
	})

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don"t remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}

			if(window.StatusBar) {
				// StatusBar.styleDefault();
				StatusBar.styleLightContent();
			}
		});
	});
})();
