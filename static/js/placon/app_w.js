(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', '$timeout', function($window, $scope, $http, $timeout){
		$scope.players = [];
		$scope.startInit = false;
		$scope.curInitInd = 0;

		angular.element(document).ready(function(){
			$scope.sock = new WebSocket('ws://' + $window.location.host + '/track/join?type=watch');
			$timeout($scope.SetupSocket, 30);
			$scope.sock.onmessage = $scope.HandleMessage;
		});

		$scope.SetupSocket = function(){
			if ($scope.sock.readyState === 1){
				$scope.sock.onmessage = $scope.HandleMessage;
				$http.get("/track/subs?type=watch").then(function(ret){
					if (ret.data.success){
						if ($scope.players.length == 0){
							$scope.players = ret.data.result;
						} else {
							$scope.players.push(ret.data.result);
						}
						//$scope.SortList($scope.players, "initiative");
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
					$scope.ApplyInit();
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
					$scope.ApplyInit();
					break;
				case 7: // Init StartInit
					if ($scope.startInit){
						$scope.startInit = false;
						$scope.players[$scope.curInitInd].isTurn = false;
					} else {
						$scope.startInit = true;
						$scope.players[0].isTurn = true;
					}
					$scope.curInitInd = 0;
					break;
				case 8: // Turn initiative
					if ($scope.startInit){
						$scope.players[$scope.curInitInd].isTurn = false;
						if (data.data === "+"){
							if ($scope.curInitInd == $scope.players.length - 1){
								$scope.curInitInd = 0;
							} else {
								$scope.curInitInd++;
							}
						} else {
							if ($scope.curInitInd == 0){
								$scope.curInitInd = $scope.players.length - 1;
							} else {
								$scope.curInitInd--;
							}
						}
						$scope.players[$scope.curInitInd].isTurn = true;
					}
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
				if (minInd !== i){
					[list[i], list[minInd]] = [list[minInd], list[i]];
				}
			}
		};

		$scope.ApplyInit = function(){
			if ($scope.startInit){
				for (var i = 0; i < $scope.players.length; i++){
					if ($scope.curInitInd == i){
						$scope.players[i].isTurn = true;
					} else {
						$scope.players[i].isTurn = false;
					}
				}
			}
		};
	}]);
})();
