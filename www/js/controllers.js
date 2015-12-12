angular.module("kreyb.controllers", [])

.controller("ItemsController", function ($scope, Items, Presence) {
	$scope.items = Items;

	$scope.addItem = function () {
		var name = prompt("What do you need to buy?");

		if(name) {
			$scope.items.$add({
				name: name
			});
		}
	};
});