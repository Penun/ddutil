(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', '$timeout', function($window, $scope, $http, $timeout){
		$scope.char = {};
		$scope.curChar = {initiative: 0};
		$scope.note = {};
		this.inpForm = {};
		$scope.longrest = {};
		$scope.backStep = $scope.curStep = 1;
		$scope.textareaReq = true;
		$scope.activeNote = "";
		this.lastNote = 0;
		$scope.charNameSug = "Name";
		this.formInput = "";
		$scope.isTurn = false;

		this.AddChar = function(){
			$scope.char.name = $scope.char.name.trim();
			if (typeof $scope.char.name === 'undefined' || $scope.char.name.length == 0){
				var charName = document.getElementById("charName");
				charName.focus();
				return;
			}
			if (typeof $scope.char.hp === 'undefined' || $scope.char.hp <= 0){
				$scope.char.hp = null;
				var charHp = document.getElementById("charHp");
				charHp.focus();
				return;
			}
			$scope.curChar = $scope.char;
			$scope.curChar.initiative = 0;
			$scope.sock = new WebSocket('ws://' + window.location.host + '/track/join?type=play&uname=' + $scope.char.name);
			$timeout(this.SetupSocket, 30);
		};

		this.SetupSocket = function(){
			if ($scope.sock.readyState === 1){
				$scope.sock.onmessage = $scope.HandleMessage;
				$http.get("/track/subs?type=play").then(function(ret){
					if (ret.data.success){
						for (var i = 0; i < ret.data.result.length; i++){
							if (ret.data.result[i].name == $scope.char.name){
								ret.data.result.splice(i, 1);
								break;
							}
						}
						$scope.subs = ret.data.result;
					}
				});
				var sendData = {
					type: "hp",
					data: {
						message: String($scope.char.hp)
					}
				};
				sendData = JSON.stringify(sendData);
				$scope.sock.send(sendData);
				$scope.SetStep(2, true);
			} else if ($scope.sock.readyState == 3){
				$scope.char = {};
				$scope.sock = null;
				$scope.charNameSug = "Name Taken.";
			}
		};

		$scope.HandleMessage = function(event){
			var data = JSON.parse(event.data);
			switch (data.type) {
				case 0: // JOIN
					if (data.player.type != "watch" && data.player.name != $scope.char.name){
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
				case 4:
					$scope.curChar.hp += Number(data.data);
					break;
				case 6:
					$scope.curChar.initiative = 0;
					break;
				case 7:
				case 8:
					$scope.isTurn = $scope.isTurn ? false : true;
					break;
				default:
					return;
			}
			$scope.$apply();
		};

		this.SendNote = function(){
			var calcedT = (Date.now() - this.lastNote) / 900000;
			if (calcedT < 1){
				$scope.activeNote = 'DM says: "Only one note every 15 minutes."\n';
				$scope.SetStep(10, false);
				return;
			}
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
				data: {
					players: $scope.note.players,
					message: $scope.note.message
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.lastNote = Date.now();
			$scope.note = {};
			$scope.SetStep(2, true);
		};

		this.ReadNote = function(){
			$scope.activeNote = "";
			$scope.SetStep($scope.backStep, false);
		};

		this.InputSet = function(inp){
			this.formInput = inp;
			this.TargetFormInput();
		};

		this.TargetFormInput = function(){
			$scope.SetStep(4, false);
			$timeout(function(){
				var inpIn = document.getElementById("inpIn");
				inpIn.focus();
			}, 50);
		};

		this.Input = function(){
			if (typeof this.inpForm.input === 'undefined'){
				var inpIn = document.getElementById("inpIn");
				inpIn.focus();
				return;
			}
			switch(this.formInput){
				case "Damage":
					this.Damage();
					break;
				case "Initiative":
					this.Initiative();
					break;
			}
		};

		this.Damage = function(){
			if (this.inpForm.input > 0){
				this.inpForm.input = -this.inpForm.input;
			}
			$scope.curChar.hp += this.inpForm.input;
			var sendData = {
				type: "hp",
				data: {
					message: String(this.inpForm.input)
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.ClearForm();
		};

		this.Initiative = function(){
			if (this.inpForm.input <= 0){
				this.TargetFormInput();
				return;
			}
			$scope.curChar.initiative = this.inpForm.input;
			var sendData = {
				type: "initiative",
				data: {
					message: String(this.inpForm.input)
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
			this.ClearForm();
		};

		this.ClearForm = function(){
			$scope.SetStep($scope.backStep, false);
			this.formInput = "";
			this.inpForm = {};
		};

		this.EndTurn = function(){
			if (!$scope.isTurn){
				return;
			}
			$scope.isTurn = false;
			var sendData = {
				type: "initiative_t",
				data: {
					message: "+"
				}
			};
			sendData = JSON.stringify(sendData);
			$scope.sock.send(sendData);
		};

		this.ShowStep = function(step){
			return $scope.curStep == step;
		};

		$scope.SetStep = function(step, upBack){
			$scope.curStep = step;
			if (upBack){
				$scope.backStep = step;
			}
		};
	}]);
})();
