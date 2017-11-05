{{template "includes/placon/header_w.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain">
		<div class="page sc_back">
            <div class="sixty_he">
				<ul>
					<li ng-repeat="(ind, play) in players">
                		<p><label><b>{{"{{play.name}}"}}</b></label></p>
					</li>
				</ul>
            </div>
		</div>
	</div>
</body>
</html>
