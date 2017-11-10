{{template "includes/placon/header_d.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain">
		<div class="page sc_back">
			<div id="menu" class="contMenu" ng-show="showMenu">
				<ul>
					<li class="clickable" ng-click="ToggleMenu()">Close</li>
					<li class="clickable" ng-click="SetStep(1, true)">Creatures</li>
					<li class="clickable" ng-click="SetStep(2, true)">Note</li>
					<li class="clickable" ng-click="SetStep(3, true)">Long Rest</li>
				</ul>
			</div>
			<div ng-show="activeNote != ''" class="sixty_he">
				<p class="note">{{"{{activeNote}}"}}</p>
				<button ng-click="mCont.ReadNote()">Read</button>
			</div>
            <div ng-show="mCont.ShowStep(1)" class="sixty_he">
				<p class="p_menu" ng-show="!showMenu"><button ng-click="ToggleMenu()">Menu</button></p>
				<p class="p_inline" ng-show="!showMenu"><button ng-click="AddEnemy()">Add Enemy</button></p>
            </div>
			<div ng-show="mCont.ShowStep(2)" class="sixty_he">
				<p class="p_menu" ng-show="!showMenu"><button ng-click="ToggleMenu()">Menu</button></p>
				<form name="noteForm" id="noteForm" novalidate>
					<select name="subSelNote" id="subSelNote" ng-show="subs.length > 0" ng-model="note.players" ng-options="sub.name as sub.name for sub in subs" multiple required></select>
					<textarea name="noteMessage" id="noteMessage" ng-model="note.message" ng-required="textareaReq"></textarea>
					<button ng-show="noteForm.$valid" ng-click="mCont.SendNote()">Send</button>
				</form>
			</div>
			<div ng-show="mCont.ShowStep(3)" class="sixty_he">
				<p class="p_menu" ng-show="!showMenu"><button ng-click="ToggleMenu()">Menu</button></p>
				<form name="longForm" id="longForm" novalidate>
					<select name="subSelLong" id="subSelLong" ng-show="subs.length > 0" ng-model="longrest.players" ng-options="sub.name as sub.name for sub in subs" multiple required></select>
					<button ng-show="longForm.$valid" ng-click="mCont.Longrest()">Longrest</button>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
