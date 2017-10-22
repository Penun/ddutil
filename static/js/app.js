(function(){
	var app = angular.module('ddcharL', ['ngSanitize']);
	app.controller('mainController', ['$scope', '$http', '$interval', '$document', function($scope, $http, $interval, $document){
		this.curTab = 1;
		this.rotateDeg = 29;
		this.curPlays = [];
		$scope.startBottom = "0px";
		$scope.bubs = [];

		angular.element(document).ready(function(){
			$http.get("/spells").then(function(ret){
				if (ret.data.occ.success){
					$scope.spells = ret.data.spells;
				} else {
					$scope.spells = [];
				}
			});
			// var divFlo = document.querySelector("#divFloat");
			// divFlo.addEventListener('webkitAnimationEnd', function(event){
			// 	var divFlo = angular.element(event.target);
			// 	if (divFlo.hasClass("rise_1")){
			// 		divFlo.removeClass("rise_1");
			// 	}
			// }, true);
			// charCol.addEventListener('animationend', function(event){
			// 	var charCol = angular.element(event.target);
			// 	if (charCol.hasClass("fade_out")){
			// 		charCol.removeClass("fade_out");
			// 		charCol.removeClass("fade_in");
			// 		charCol.addClass("fade_nu");
			// 	}
			// }, true);
			$scope.goose = $interval(function(){
				var stLeft = Math.floor(Math.random() * 900) / 10 + 10;
				var raRise = Math.floor(Math.random() * 3);
				var stop = $interval(function(){

				}, 100);
				$scope.bubs.push({
					left: stLeft,
					rise: raRise
				})
			}, 1500);
			var bod = window.innerHeight - $document[0].body.clientHeight + 30;
			if (bod > 0){
				$scope.startBottom = "-" + bod + "px";
			} else {
				bod *= -1;
				$scope.startBottom = bod + "px";
			}
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

		this.Bubble = function(){

		};
	}]);
})();
