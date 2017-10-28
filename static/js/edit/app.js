(function(){
	var app = angular.module('ddcharL', []);
	app.controller('mainController', ['$window', '$scope', '$http', function($window, $scope, $http){
		this.curTab = 1;
		this.rotateDeg = 29;
		$scope.moldSpell = {};

		angular.element(document).ready(function(){
			$http.get("/spells").then(function(ret){
				if (ret.data.occ.success){
					$scope.spells = [];
					for (var i = 0; i < ret.data.spells.length; i++){
						$scope.spells.push({
							id: ret.data.spells[i].Id,
							name: ret.data.spells[i].Name,
							school: ret.data.spells[i].School,
							level: ret.data.spells[i].Level
						});
					}
				} else {
					$scope.spells = [];
				}
			});
		});

		this.AddSpell = function(){
			var sendata = {
				"spell": $scope.moldSpell,
			};
			sendata.spell.name = sendata.spell.name.trim();
			sendata.spell.level = Number(sendata.spell.level);
			$http.post("/spells/add", sendata).then(function(ret){
				if (ret.data.occ.success){
					$scope.spells.push(ret.data.spell);
					$scope.moldSpell = {};
					document.getElementById("spelName").focus();
				}
			});
		};

		this.CheckSpell = function(){
			if ($scope.moldSpell.name != ""){
				var found = false;
				for (var i = 0; i < $scope.spells.length; i++){
					if ($scope.moldSpell.name == $scope.spells[i].Name){
						found = true;
						break;
					}
				}
				this.ApplyInClass(found, "#spelName");
			}
		};

		this.ApplyInClass = function(found, id){
			var inpNam = angular.element(document.querySelector(id));
			if (found){
				inpNam.addClass("found");
			} else if (inpNam.hasClass("found")) {
				inpNam.removeClass("found");
			}
		};

		this.LoadTab = function(newTab){
			this.curTab = newTab;
		};

		this.ShowTab = function(tab_id){
			return this.curTab === tab_id;
		};
	}]);
})();
