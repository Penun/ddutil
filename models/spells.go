package models

import (
    "github.com/astaxie/beego/orm"
)

func GetSpells() []Spell{
    o := orm.NewOrm()
    var spells []Spell
    o.QueryTable("spell").OrderBy("name").All(&spells)
    if len(spells) > 0 {
        return spells
    } else {
        return []Spell{}
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
