{{template "includes/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain" ng-style="{'transform': 'rotateX('+mCont.rotateDeg+'deg)', '-moz-transform': 'rotateX('+mCont.rotateDeg+'deg)', '-webkit-transform': 'rotateX('+mCont.rotateDeg+'deg)'}">
		<div class="page sc_back">
			{{template "spells.tpl"}}
		</div>
	</div>
	<div class="aura aura_exp aura_hDn" id="aura"></div>
	<div id="divFloat_{{"{{ind}}"}}" class="rise_{{"{{bub.rise}}"}} sc_back bubble" ng-repeat="(ind, bub) in bubs"  ng-style="{'left': bub.left+'%', 'bottom': startBottom}"></div>
</body>
</html>
