(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', '$timeout', function($window, $scope, $http, $timeout){
		$scope.char = {};
		$scope.note = {};
		$scope.showMenu = false;
		$scope.backStep = $scope.curStep = 1;
		$scope.textareaReq = true;
		$scope.activeNote = "";
		this.lastNote = 0;

		angular.element(document).ready(function(){
			$scope.sock = new WebSocket('ws://' + window.location.host + '/track/join?type=master&uname=DM');
			$timeout($scope.SetupSocket, 30);
		});

		$scope.ToggleMenu = function(){
			if ($scope.showMenu){
				$scope.showMenu = false;
			} else {
				$scope.showMenu = true;
			}
		};

		$scope.HandleMessage = function(event){
			var data = JSON.parse(event.data);
			console.log(data);
			switch (data.type) {
			case 0: // JOIN
				if (data.player.type == "play" && data.player.name != $scope.char.name){
					$scope.subs.push(data.player);
				}
				break;
			case 1: // LEAVE
				for (var i = 0; i < $scope.subs.length; i++){
					if ($scope.subs[i].name == data.player.name){
						$scope.subs.splice(i, 1);
						break;
					}
				}
				break;
			case 2: // NOTE
				$scope.activeNote += data.player.name + ' says: "' + data.data + '"\n';
				$scope.SetStep(0, false);
				break;
			}
			$scope.$apply();
		};

		this.SendNote = function(){
			if (typeof $scope.note.players === 'undefined' || $scope.note.players.length == 0){
				var subSel = document.getElementById("subSel");
				subSel.focus();
				return;
			}
			if (typeof $scope.note.message === 'undefined' || $scope.note.message.length == 0){
				var noteMessage = document.getElementById("noteMessage");
				noteMessage.focus();
				return;
			}

			var sendData = {
				type: "note",
				data: JSON.stringify({
					players: $scope.note.players,
					message: $scope.note.message
				})
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.lastNote = Date.now();
			$scope.note = {};
			$scope.SetStep(1);
		};

		this.ReadNote = function(){
			$scope.activeNote = "";
			$scope.SetStep($scope.backStep, false);
		};

		this.Longrest = function(){
			var sendData = {
				type: "longrest",
				data: JSON.stringify({
					players: $scope.longrest.players
				})
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			$scope.SetStep(1);
		};

		this.FocusKi = function(){
			if ($scope.char.hasKi){
				var charKi = document.getElementById("charKi");
				charKi.focus();
			}
		};

		this.ShowStep = function(step){
			return $scope.curStep == step;
		};

		$scope.SetupSocket = function(){
			if ($scope.sock.readyState === 1){
				$scope.sock.onmessage = $scope.HandleMessage;
				$http.get("/track/subs").then(function(ret){
					if (ret.data.success){
						for (var i = 0; i < ret.data.result.length; i++){
							if (ret.data.result[i].name == "DM" || ret.data.result[i].type == "master"){
								ret.data.result.splice(i, 1);
								break;
							}
						}
						$scope.subs = ret.data.result;
					}
				});
			}
		};

		$scope.SetStep = function(step, upBack){
			$scope.curStep = step;
			if (upBack){
				$scope.backStep = step;
			}
			if ($scope.showMenu){
				$scope.ToggleMenu();
			}
		};
	}]);
})();
