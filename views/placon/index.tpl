{{template "includes/placon/header.tpl"}}
<body ng-controller="mainController as mCont" ng-cloak>
	<div class="mainDiv" id="forwardMain">
		<div class="page sc_back">
			<div id="menu" class="sixty_he" ng-show="mCont.ShowStep(0)">
				<ul>
					<li class="clickable" ng-click="SetStep(backStep, false)">Close</li>
					<li class="clickable" ng-click="SetStep(3, true)">Note</li>
					<li class="clickable" ng-click="SetStep(2, true)">Stats</li>
				</ul>
			</div>
			<div ng-show="mCont.ShowStep(10)" class="sixty_he">
				<p class="note">{{"{{activeNote}}"}}</p>
				<button ng-click="mCont.ReadNote()">Read</button>
			</div>
            <div ng-show="mCont.ShowStep(1)" class="sixty_he">
                <form id="charAddForm" name="charAddForm" novalidate>
                    <p><label><b>Name:</b></label> <input type="text" name="charName" id="charName" ng-model="char.name" tabindex="1" autofocus required placeholder="{{"{{charNameSug}}"}}"/></p>
                    <p><label><b>HP:</b></label> <input type="number" name="charHp" id="charHp" ng-model="char.hp" min="1" placeholder="0" required/></p>
                    <!-- <p><input type="checkbox" name="hasKi" id="hasKi" ng-model="char.hasKi" ng-click="mCont.FocusKi()" /> <label><b>Ki<span ng-show="!char.hasKi" class="inline_span">?</span>:</b></label> <input type="number" ng-show="char.hasKi" name="charKi" id="charKi" ng-model="char.ki" min="1" max="20" placeholder="0" /></p>
                    <p><input type="checkbox" name="hasSpells" id="hasSpells" ng-model="char.hasSpells" ng-click="mCont.FocusSpell()" /> <label><b>Spells<span ng-show="!char.hasSpells" class="inline_span">?</span>:</b></label></p>
					<p ng-show="char.hasSpells"><label for="charSpe1">1st Lvl:</label> <input type="number" name="charSpe1" id="charSpe1" ng-model="char.spe1" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe1 != null && char.spe1 > 0"><label for="charSpe2">2nd Lvl:</label> <input type="number" name="charSpe2" id="charSpe2" ng-model="char.spe2" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe2 != null && char.spe2 > 0"><label for="charSpe3">3rd Lvl:</label> <input type="number" name="charSpe3" id="charSpe3" ng-model="char.spe3" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe3 != null && char.spe3 > 0"><label for="charSpe4">4th Lvl:</label> <input type="number" name="charSpe4" id="charSpe4" ng-model="char.spe4" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe4 != null && char.spe4 > 0"><label for="charSpe5">5th Lvl:</label> <input type="number" name="charSpe5" id="charSpe5" ng-model="char.spe5" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe5 != null && char.spe5 > 0"><label for="charSpe6">6th Lvl:</label> <input type="number" name="charSpe6" id="charSpe6" ng-model="char.spe6" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe6 != null && char.spe6 > 0"><label for="charSpe7">7th Lvl:</label> <input type="number" name="charSpe7" id="charSpe7" ng-model="char.spe7" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe7 != null && char.spe7 > 0"><label for="charSpe8">8th Lvl:</label> <input type="number" name="charSpe8" id="charSpe8" ng-model="char.spe8" min="1" max="20" placeholder="0" /></p>
					<p ng-show="char.spe8 != null && char.spe8 > 0"><label for="charSpe9">9th Lvl:</label> <input type="number" name="charSpe9" id="charSpe9" ng-model="char.spe9" min="1" max="20" placeholder="0" /></p> -->
                    <button ng-show="charAddForm.$valid" ng-click="mCont.AddChar()" class="next_butt">Join</button>
                </form>
            </div>
            <div ng-show="mCont.ShowStep(2)" class="sixty_he">
				<p class="s_ws_p_inline"><button ng-click="SetStep(0, false)">Menu</button></p>
                <p class="s_ws_p_inline"><label><b>{{"{{char.name}}"}}</b></label></p>
                <p class="s_ws_p_inline"><label><b>Initiative:</b></label> {{"{{curChar.initiative}}"}} <button ng-show="curChar.initiative == 0" ng-click="mCont.InputSet('Initiative')" class="inline_butt">Set</button></p>
                <p class="s_ws_p_inline"><label><b>HP:</b></label> {{"{{curChar.hp}}"}} <button ng-click="mCont.InputSet('Damage')" class="inline_butt">-</button></p>
            </div>
			<div ng-show="mCont.ShowStep(3)" class="sixty_he">
				<p class="s_ws_p_inline"><button ng-click="SetStep(0, false)">Menu</button></p>
				<form name="noteForm" id="noteForm" novalidate>
					<select name="subSel" id="subSel" ng-show="subs.length > 0" ng-model="note.players" ng-options="sub.name as sub.name for sub in subs" multiple required></select>
					<textarea name="noteMessage" id="noteMessage" ng-model="note.message" ng-required="textareaReq"></textarea>
					<button ng-show="noteForm.$valid" ng-click="mCont.SendNote()">Send</button>
				</form>
			</div>
			<div ng-show="mCont.ShowStep(4)" class="sixty_he">
				<p class="s_ws_p_inline"><button ng-click="mCont.ClearForm()">Cancel</button></p>
				<form name="inpForm" id="inpForm" novalidate>
					<p class="s_ws_p_inline"><label for="damIn"><b>{{"{{mCont.formInput}}"}}:</b></label> <input type="number" name="inpIn" id="inpIn" ng-model="mCont.inpForm.input" placeholder="0" required/></p>
					<button ng-show="inpForm.$valid" ng-click="mCont.Input()">{{"{{mCont.formInput}}"}}</button>
				</form>
            </div>
		</div>
	</div>
</body>
</html>
