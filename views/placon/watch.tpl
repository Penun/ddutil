{{template "includes/placon/header_w.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain">
		<div class="page sc_back">
            <div class="sixty_he">
				<ul>
					<li ng-repeat="(ind, play) in players" ng-class="{activePlayer: startInit && play.isTurn, player: !play.isTurn || !startInit }">
                		<span><b>{{"{{play.name}}"}}</b></span>
						<span><b>Init:</b> {{"{{play.initiative}}"}}</span>
                		<span><b>HP:</b> {{"{{play.hp}}"}}</span>
					</li>
				</ul>
            </div>
		</div>
	</div>
</body>
</html>
