(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', '$timeout', function($window, $scope, $http, $timeout){
		$scope.char = {};
		this.inText = {};
		this.action = {};
		this.inpForm = {};
		$scope.backStep = $scope.curStep = 1;
		this.textareaReq = true;
		$scope.activeNote = "";
		this.actionText = "";
		this.inTextText = "";
		this.inputText = "";

		angular.element(document).ready(function(){
			$scope.sock = new WebSocket('ws://' + window.location.host + '/track/join?type=master&uname=DM');
			$timeout($scope.SetupSocket, 30);
		});

		$scope.HandleMessage = function(event){
			var data = JSON.parse(event.data);
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
				$scope.SetStep(10, false);
				break;
			}
			$scope.$apply();
		};

		this.ReadNote = function(){
			$scope.activeNote = "";
			$scope.SetStep($scope.backStep, false);
		};

		this.InTextSet = function(inT){
			this.inTextText = inT;
			$scope.SetStep(2, true);
		};

		this.InText = function(){
			if (typeof this.inText.players === 'undefined' || this.inText.players.length == 0){
				var subSel = document.getElementById("subSelInText");
				subSel.focus();
				return;
			}
			if (typeof this.inText.message === 'undefined' || this.inText.message.length == 0){
				var inTextMessage = document.getElementById("inTextMessage");
				inTextMessage.focus();
				return;
			}
			var type = "";
			switch(this.inTextText){
				case "Note":
					type = "note";
					break;
				default:
					return;
			}
			var sendData = {
				type: "note",
				data: {
					players: this.inText.players,
					message: this.inText.message
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.ClearForm(2);
			$scope.SetStep(1, true);
		};

		this.ActionSet = function(act){
			this.actionText = act;
			$scope.SetStep(3, true);
		};

		this.Action = function(){
			if (typeof this.action.players === 'undefined' || this.action.players.length == 0){
				var subSel = document.getElementById("subSelAct");
				subSel.focus();
				return;
			}
			var type = "";
			switch(this.actionText){
				case "Initiative":
					type = "initiative_d";
					break;
				case "Longrest":
					type = "longrest";
					break;
				default:
					return;
			}
			var sendData = {
				type: type,
				data: {
					players: this.action.players,
					message: "action"
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.ClearForm(3);
			$scope.SetStep(1, true);
		};

		this.InputSet = function(inp){
			this.inputText = inp;
			$scope.SetStep(4, true);
		};

		this.Input = function(){
			if (typeof this.inpForm.players === 'undefined' || this.inpForm.players.length == 0){
				var subSel = document.getElementById("subSelInp");
				subSel.focus();
				return;
			}
			if (typeof this.inpForm.input === 'undefined' || this.inpForm.input <= 0){
				var inpIn = document.getElementById("inpIn");
				inpIn.focus();
				return;
			}
			var type = "";
			switch(this.inputText){
				case "Heal":
					type = "hp";
					break;
				default:
					return;
			}
			var sendData = {
				type: type,
				data: {
					players: this.inpForm.players,
					message: String(this.inpForm.input)
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.ClearForm(4);
			$scope.SetStep(1, true);
		};

		this.ShowStep = function(step){
			return $scope.curStep == step;
		};

		this.ClearForm = function(form){
			$scope.SetStep(1, true);
			switch(form){
				case 2:
					this.inText = {};
					this.inTextText = "";
					break;
				case 3:
					this.action = {};
					this.actionText = "";
					break;
				case 4:
					this.inpForm = {};
					this.inputText = "";
					break;
				default:
					return;
			}
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
		};
	}]);
})();
