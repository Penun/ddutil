(function(){
	var app = angular.module('ddcharL', ['ngSanitize']);
	app.controller('mainController', ['$scope', '$http', function($scope, $http){
		this.curTab = 1;
		this.rotateDeg = 29;
		this.curPlays = [];

		angular.element(document).ready(function(){
			$http.get("/spells").then(function(ret){
				if (ret.data.occ.success){
					$scope.spells = ret.data.spells;
				} else {
					$scope.spells = [];
				}
			});
		});

		this.RevealSpell = function(ind){
			$scope.curSpell = $scope.spells[ind];
			angular.element(document.querySelector("#popPanel")).toggleClass("fade_in fade_nu");
		};

		this.CloseSpell = function(){
			$scope.curSpell = null;
			angular.element(document.querySelector("#popPanel")).toggleClass("fade_in fade_nu");
		};

		this.AddPlay = function(){
			this.curPlays.push(this.moldPlay);
			this.moldPlay = {};
			document.querySelector("#initName").focus();
			this.lastSort = "___a";
			this.SortList(this.curPlays, "initiative", "__");
		};

		this.DelPlay = function(index){
			this.curPlays.splice(index, 1);
		};

		this.LoadTab = function(newTab){
			this.curTab = newTab;
		};

		this.ShowTab = function(tab_id){
			return this.curTab === tab_id;
		};

		this.SortList = function(list, varName, colC){
			if (this.lastSort != colC + "_" + "a"){
				for (var i = 0; i < list.length; i++){
					var minInd = i;
					for (j = i; j < list.length; ++j){
						if (list[j][varName] < list[minInd][varName]){
							minInd = j;
						}
					}
					[list[i], list[minInd]] = [list[minInd], list[i]];
				}
				this.lastSort = colC + "_" + "a";
			} else {
				for (var i = 0; i < list.length; i++){
					var minInd = i;
					for (j = i; j < list.length; ++j){
						if (list[j][varName] > list[minInd][varName]){
							minInd = j;
						}
					}
					[list[i], list[minInd]] = [list[minInd], list[i]];
				}
				this.lastSort = colC + "_" + "d";
			}
		};
	}]);
})();
