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
                </tr>
                <tr ng-repeat="(ind, spell) in spells" ng-click="mCont.RevealSpell(ind)" class="item">
                    <td class="rang">{{"{{spell.name}}"}}</td>
                    <td class="rang">{{"{{spell.school}}"}}</td>
                    <td class="rang" ng-if="spell.level == 0">Cantrip</td>
                    <td class="rang" ng-if="spell.level != 0">{{"{{spell.level}}"}}</td>
                </tr>
            </table>
            <div class="popBox talentPanelOut fade_nu" id="popPanel" ng-show="curSpell != null">
                <div class="talentPanel">
                    <h1>{{"{{curSpell.name}}"}}</h1><button type="button" ng-click="mCont.CloseSpell()" style="font-size: 0.5em; position: absolute; right: 25px;">X</button>
                    <div class="characterBlock"><b>School:</b> {{"{{curSpell.school}}"}}</div>
                    <div class="characterBlock" ng-if="curSpell.level == 0"><b>Level:</b> Cantrip</div>
                    <div class="characterBlock" ng-if="curSpell.level != 0"><b>Level:</b> {{"{{curSpell.level}}"}}</div>
                    <div class="characterBlock" ng-if="curSpell.ritual"><b><i>(Ritual)</i></b></div>
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
