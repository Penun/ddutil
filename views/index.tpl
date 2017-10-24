{{template "includes/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain" ng-style="{'transform': 'rotateX('+mCont.rotateDeg+'deg)', '-moz-transform': 'rotateX('+mCont.rotateDeg+'deg)', '-webkit-transform': 'rotateX('+mCont.rotateDeg+'deg)'}">
		<div class="sideNav" id="sideNav">
			<span class="tab" ng-click="mCont.LoadTab(1)"><img src="/static/img/sp.png" alt="" /></span>
			<span class="tab" ng-click="mCont.LoadTab(2)"><img src="/static/img/in.png" alt="" /></span>
		</div>
		<div class="page sc_back">
			{{template "spells.tpl"}}
			{{template "initiative.tpl"}}
		</div>
	</div>
	<div class="aura aura_exp aura_hDn" id="aura"></div>
	<div id="divFloat_{{"{{ind}}"}}" class="rise_{{"{{bub.rise}}"}} sc_back bubble" ng-repeat="(ind, bub) in bubs"  ng-style="{'left': bub.left+'%', 'bottom': startBottom}"></div>
</body>
</html>
