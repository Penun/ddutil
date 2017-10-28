package routers

import (
	"github.com/Penun/ddutil/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/edit", &controllers.EditController{})
    beego.Router("/spells", &controllers.SpellsController{})
    beego.Router("/spells/spell", &controllers.SpellsController{}, "post:Spell")
    beego.Router("/spells/add", &controllers.SpellsController{}, "post:Add")
}
