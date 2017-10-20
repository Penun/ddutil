{{template "includes/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="headDiv" id="headDiv">

	</div>
	<div class="mainDiv" id="forwardMain" ng-style="{'transform': 'rotateX('+mCont.rotateDeg+'deg)', '-moz-transform': 'rotateX('+mCont.rotateDeg+'deg)', '-webkit-transform': 'rotateX('+mCont.rotateDeg+'deg)'}">
		<!-- <div class="tab_header sw_back" id="tabHeader">
			<span class="tab" ng-click="mCont.LoadTab(1)">Species</span>
		</div> -->
		<div class="page sc_back">
			{{template "spells.tpl"}}
		</div>
	</div>
</body>
</html>
