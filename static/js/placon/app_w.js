(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', '$timeout', function($window, $scope, $http, $timeout){
		$scope.players = [];

		angular.element(document).ready(function(){
			$scope.sock = new WebSocket('ws://' + $window.location.host + '/track/join?type=watch');
			$timeout($scope.SetupSocket, 30);
			$scope.sock.onmessage = $scope.HandleMessage;
		});

		$scope.SetupSocket = function(){
			if ($scope.sock.readyState === 1){
				$scope.sock.onmessage = $scope.HandleMessage;
				$http.get("/track/subs").then(function(ret){
					if (ret.data.success){
						for (var i = 0; i < ret.data.result.length; i++){
							if (ret.data.result[i].type == "master"){
								ret.data.result.splice(i, 1);
								i--;
							}
						}
						if ($scope.players.length == 0){
							$scope.players = ret.data.result;
						} else {
							$scope.players.push(ret.data.result);
						}
					}
				});
			}
		};

		$scope.HandleMessage = function(event){
			var data = JSON.parse(event.data);
			switch (data.type) {
			case 0: // JOIN
				if (data.player.type == "play"){
					$scope.players.push(data.player);
				}
				break;
			case 1: // LEAVE
				for (var i = 0; i < $scope.players.length; i++){
					if ($scope.players[i].name == data.player.name){
						$scope.players.splice(i, 1);
						break;
					}
				}
				break;
			case 4: // HP
				for (var i = 0; i < $scope.players.length; i++){
					if ($scope.players[i].name == data.player.name){
						if (typeof $scope.players[i].hp === 'undefined'){
							$scope.players[i].hp = Number(data.data);
						} else {
							$scope.players[i].hp += Number(data.data);
						}
						break;
					}
				}
				break;
			}
			$scope.$apply();
		};
	}]);
})();
