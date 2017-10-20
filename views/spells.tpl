<div ng-show="mCont.ShowTab(1)" class="sixty_he fade_in">
    <div class="tablePage">
        <div class="tabPag_inner">
            <table>
                <tr class="bg_none">
                    <td colspan="4" class="table_name">Spells</td>
                </tr>
                <tr>
                    <th ng-click="mCont.SortList(spells, 'name', 'spNa')">Name</th>
                    <th ng-click="mCont.SortList(spells, 'school', 'spSc')">School</th>
                    <th ng-click="mCont.SortList(spells, 'level', 'spLe')">Level</th>
                    <th ng-click="mCont.SortList(spells, 'range', 'spRa')">Range</th>
                </tr>
                <tr ng-repeat="(ind, spell) in spells" ng-click="mCont.RevealSpell(ind)" class="item">
                    <td>{{"{{spell.name}}"}}</td>
                    <td class="rang">{{"{{spell.school}}"}}</td>
                    <td class="rang" ng-if="spell.level == 0">Cantrip</td>
                    <td class="rang" ng-if="spell.level != 0">{{"{{spell.level}}"}}</td>
                    <td class="rang">{{"{{spell.range}}"}}</td>
                </tr>
            </table>
            <div class="popBox talentPanelOut" ng-show="curSpell != null">
                <div class="talentPanel fade_nu" id="popPanel">
                    <h1>{{"{{curSpell.name}}"}}</h1><button type="button" ng-click="mCont.CloseSpell()" style="font-size: 0.5em; position: absolute; right: 25px;">X</button>
                    <div class="characterBlock"><b>School:</b> {{"{{curSpell.school}}"}}</div>
                    <div class="characterBlock">
                        <span ng-if="spell.level == 0">Cantrip</span>
                        <span ng-if="spell.level == 0"><b>Level:</b> {{"{{curSpell.level}}"}}</span>
                    </div>
                    <div class="characterBlock"><b>Casting Time:</b> {{"{{curSpell.casting_time}}"}}</div>
                    <div class="characterBlock"><b>Range:</b> {{"{{curSpell.range}}"}}</div>
                    <div class="characterBlock"><b>Components:</b> {{"{{curSpell.components}}"}}</div>
                    <div class="characterBlock"><b>Duration:</b> {{"{{curSpell.duration}}"}}</div>
                    <div ng-bind-html="curSpell.description" class="taleDesc"></div>
                </div>
            </div>
        </div>
    </div>
</div>
