{{template "includes/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain" ng-style="{'transform': 'rotateX('+mCont.rotateDeg+'deg)', '-moz-transform': 'rotateX('+mCont.rotateDeg+'deg)', '-webkit-transform': 'rotateX('+mCont.rotateDeg+'deg)'}">
		<div class="page sc_back">
			{{template "spells.tpl"}}
		</div>
	</div>
</body>
</html>
