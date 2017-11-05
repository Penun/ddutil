(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', function($window, $scope, $http){
		$scope.char = {};
		$scope.note = {};
		$scope.showMenu = false;
		$scope.backStep = $scope.curStep = 1;
		$scope.textareaReq = true;
		$scope.activeNote = "";
		this.lastNote = 0;

		this.AddChar = function(){
			$scope.char.name = $scope.char.name.trim();
			if (typeof $scope.char.name === 'undefined' || $scope.char.name.length == 0){
				var charName = document.getElementById("charName");
				charName.focus();
				return;
			}
			this.sock = new WebSocket('ws://' + window.location.host + '/track/join?type=play&uname=' + $scope.char.name);
			this.sock.onmessage = this.HandleMessage;
			$http.get("/track/subs").then(function(ret){
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
			$scope.SetStep(2, true);
		};

		$scope.ToggleMenu = function(){
			if ($scope.showMenu){
				$scope.showMenu = false;
			} else {
				$scope.showMenu = true;
			}
		};

		this.HandleMessage = function(event){
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
			var calcedT = (Date.now() - this.lastNote) / 900000;
			if (calcedT < 1){
				$scope.activeNote = 'DM says: Only one note every 15 minutes."\n';
				$scope.SetStep(0, false);
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
				data: JSON.stringify({
					players: $scope.note.players,
					message: $scope.note.message
				})
			};
			sendData = JSON.stringify(sendData);
			this.sock.send(sendData);
			this.lastNote = Date.now();
			$scope.note = {};
			$scope.SetStep(2);
		};

		this.ReadNote = function(){
			$scope.activeNote = "";
			$scope.SetStep($scope.backStep, false);
		}

		this.FocusKi = function(){
			if ($scope.char.hasKi){
				var charKi = document.getElementById("charKi");
				charKi.focus();
			}
		}

		this.FocusSpell = function(){
			if ($scope.char.hasSpells){
				var charSp = document.getElementById("charSpe1");
				charSp.focus();
			}
		}

		this.ShowStep = function(step){
			return $scope.curStep == step;
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
