<div ng-show="mCont.ShowTab(2)" class="sixty_he">
    <div class="left_page_col">
        <div class="fade_in" style="width: 95%">
            <h2>Characters</h2>
            <div class="innerList">
                <ul>
				    <li ng-repeat="(ind, play) in mCont.curPlays">
					    <span class="clickable" ng-click="mCont.DelPlay(ind)">
                            {{"{{play.name}}"}} - {{"{{play.initiative}}"}}
					    </span>
				    </li>
			    </ul>
            </div>
        </div>
    </div>
    <div class="right_page right_page_form">
        <form id="spellAddForm" name="spellAddForm" novalidate>
            <p><label><b>Name:</b></label> <input type="text" name="initName" id="initName" ng-model="mCont.moldPlay.name" required/></p>
            <p><label><b>Initiative:</b></label> <input type="number" name="initInit" ng-model="mCont.moldPlay.initiative" required/></p>
            <button ng-show="spellAddForm.$valid" ng-click="mCont.AddPlay()" class="next_butt">Add</button>
        </form>
    </div>
</div>
