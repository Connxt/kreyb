angular.module("kreyb", [
	"kreyb.controllers",
	"kreyb.services",
	"kreyb.directives",
	"kreyb.filters",
	"ionic",
	"firebase",
	"pouchdb",
	"jett.ionic.filter.bar",
	"jett.ionic.content.banner",
])

.constant("API_URL", "https://kreyb.firebaseio.com/")

.config(function ($stateProvider, $urlRouterProvider) {
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
				controller: "RestaurantListController",
				resolve: {
					restaurants: function (Restaurants) {
						return Restaurants;
					}
				}
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
			StatusBar.styleDefault();
		}
	});
});
