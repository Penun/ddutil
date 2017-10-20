<div ng-show="mCont.ShowTab(1)" class="sixty_he">
    <div class="left_page_col left_page">
        <div class="fade_in" style="width: 95%">
            <h2>Spells</h2>
            <div class="innerList">
                <ul>
				    <li ng-repeat="(ind, spell) in spells">
					    <span class="clickable">
                            {{"{{spell.name}}"}}
					    </span>
				    </li>
			    </ul>
            </div>
        </div>
    </div>
    <div class="right_page right_page_form">
        <form id="spellAddForm" name="spellAddForm" novalidate>
            <p><label><b>Name:</b></label> <input type="text" name="spelName" id="spelName" ng-model="moldSpell.name" ng-change="mCont.CheckSpell()" required/></p>
            <p><label><b>School:</b></label> <select name="spelSchool" ng-model="moldSpell.school" class="sing_select">
                <option value="Abjuration">Abjuration</option>
                <option value="Conjuration">Conjuration</option>
                <option value="Divination">Divination</option>
                <option value="Enchantment">Enchantment</option>
                <option value="Evocation">Evocation</option>
                <option value="Illusion">Illusion</option>
                <option value="Necromancy">Necromancy</option>
                <option value="Transmutation">Transmutation</option>
            </select></p>
            <p><label><b>Level:</b></label> <select name="spelLev" ng-model="moldSpell.level" class="sing_select">
                <option value="0">Cantrip</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
            </select></p>
            <p><label><b>Casting Time:</b></label> <input type="text" name="spelCas" ng-model="moldSpell.casting_time" required/></p>
            <p><label><b>Range:</b></label> <input type="text" name="spelRan" ng-model="moldSpell.range" required/></p>
            <p><label><b>Components:</b></label> <input type="text" name="spelComp" ng-model="moldSpell.components" required/></p>
            <p><label><b>Duration:</b></label> <input type="text" name="spelDur" ng-model="moldSpell.duration" required/></p>
            <div class="abilities"><label><b>Description:</b></label> <textarea name="spelDesc" ng-model="moldSpell.description" rows="5" required></textarea></div>
            <button ng-show="spellAddForm.$valid" ng-click="mCont.AddSpell()" class="next_butt">Save</button>
        </form>
    </div>
</div>
