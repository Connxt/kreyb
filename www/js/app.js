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
		"ionicLazyLoad",
		"ionic-native-transitions"
	])

	.constant("API_URL", "https://kreyb.firebaseio.com/")

	.constant("OFFLINE_KEY", "kreyb.restaurants")

	.constant("MAX_LOADING_TIME", 100000)

	.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider, $ionicNativeTransitionsProvider) {
		$ionicConfigProvider.scrolling.jsScrolling(false);
		
		$ionicNativeTransitionsProvider.setDefaultOptions({
			duration: 400, // in milliseconds (ms), default 400,
			slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
			iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
			androiddelay: -1, // same as above but for Android, default -1
			winphonedelay: -1, // same as above but for Windows Phone, default -1,
			fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
			fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
			triggerTransitionEvent: "$ionicView.afterEnter", // internal ionic-native-transitions option
			backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
		});
		$ionicNativeTransitionsProvider.setDefaultTransition({
			type: "slide",
			direction: "left"
		});
		$ionicNativeTransitionsProvider.setDefaultBackTransition({
			type: "slide",
			direction: "right"
		});
		$ionicNativeTransitionsProvider.enable(true, false);


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
