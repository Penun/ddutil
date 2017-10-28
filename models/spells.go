package models

import (
    "github.com/astaxie/beego/orm"
)

func GetSpellList() []orm.Params{
    o := orm.NewOrm()
    var spells []orm.Params
    o.QueryTable("spell").OrderBy("name").Values(&spells, "id", "name", "school", "level")
    if len(spells) > 0 {
        return spells
    } else {
        return []orm.Params{}
    }
}

func GetSpell(sp_id int64) Spell{
    o := orm.NewOrm()
    var spell Spell
    err := o.QueryTable("spell").Filter("id", sp_id).One(&spell)
    if err == nil {
        return spell
    } else {
        return Spell{}
    }
}

func AddSpell(spe Spell) int64 {
	o := orm.NewOrm()
	id, err := o.Insert(&spe)
	if err == nil {
		return id
	} else {
		return 0
	}
}
