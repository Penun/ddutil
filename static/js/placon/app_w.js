(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', function($window, $scope, $http){
		$scope.players = [];

		angular.element(document).ready(function(){
			this.sock = new WebSocket('ws://' + $window.location.host + '/track/join?type=watch');
			this.sock.onmessage = function (event) {
		        var data = JSON.parse(event.data);
		        console.log(data);
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
		        case 2: // ADJUST
					for (var i = 0; i < $scope.players.length; i++){
						if ($scope.players[i].name == data.player.name){
							$scope.players[i] = data.player;
							break;
						}
					}
		            break;
		        }
				$scope.$apply();
		    };
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
		});
	}]);
})();
