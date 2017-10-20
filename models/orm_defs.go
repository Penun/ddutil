package models

import (
    "github.com/astaxie/beego/orm"
)

type Spell struct {
    Id int64 `orm:"pk" json:"id"`
    Name string `json:"name"`
    School string `json:"school"`
    Level int `json:"level"`
    CastingTime string `json:"casting_time"`
    Range string `json:"range"`
    Components string `json:"components"`
    Duration string `json:"duration"`
    Description string `json:"description"`
}

func init() {
    orm.RegisterModel(new(Spell))
}
