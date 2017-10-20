{{template "includes/edit/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain" ng-mousemove="mCont.MoveBook($event)" ng-style="{'transform': 'rotateX('+mCont.rotateDeg+'deg)', '-moz-transform': 'rotateX('+mCont.rotateDeg+'deg)', '-webkit-transform': 'rotateX('+mCont.rotateDeg+'deg)'}">
		<div class="page sc_back">
			{{ template "edit/spells.tpl" }}
		</div>
	</div>
</body>
</html>
