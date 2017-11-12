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
							} else if (typeof ret.data.result[i].initiative === 'undefined'){
								ret.data.result[i].initiative = 0;
							}
						}
						if ($scope.players.length == 0){
							$scope.players = ret.data.result;
						} else {
							$scope.players.push(ret.data.result);
						}
						$scope.SortList($scope.players, "initiative");
					}
				});
			}
		};

		$scope.HandleMessage = function(event){
			var data = JSON.parse(event.data);
			switch (data.type) {
				case 0: // JOIN
					if (data.player.type == "play"){
						data.player.initiative = 0; 
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
					if (data.player.type != "master"){
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
					} else {
						for (var i = 0; i < data.players.length; i++){
							for (var j = 0; j < $scope.players.length; j++){
								if ($scope.players[j].name == data.players[i]){
									$scope.players[j].hp += Number(data.data);
									break;
								}
							}
						}
					}
					break;
				case 5: // INITIATIVE
					for (var i = 0; i < $scope.players.length; i++){
						if ($scope.players[i].name == data.player.name){
							$scope.players[i].initiative = Number(data.data);
							break;
						}
					}
					$scope.SortList($scope.players, "initiative");
					break;
				case 6: // INITIATIVE DM RESET
					for (var i = 0; i < data.players.length; i++){
						for (var j = 0; j < $scope.players.length; j++){
							if ($scope.players[j].name == data.players[i]){
								$scope.players[j].initiative = 0;
								break;
							}
						}
					}
					$scope.SortList($scope.players, "initiative");
					break;
			}
			$scope.$apply();
		};

		$scope.SortList = function(list, varName){
			for (var i = 0; i < list.length; i++){
				var minInd = i;
				for (j = i; j < list.length; ++j){
					if (list[j][varName] > list[minInd][varName]){
						minInd = j;
					}
				}
				[list[i], list[minInd]] = [list[minInd], list[i]];
			}
		};
	}]);
})();
