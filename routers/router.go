package routers

import (
	"github.com/Penun/ddutil/controllers"
	"github.com/Penun/ddutil/controllers/placon"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/edit", &controllers.EditController{})
    beego.Router("/spells", &controllers.SpellsController{})
    beego.Router("/spells/spell", &controllers.SpellsController{}, "post:Spell")
    beego.Router("/spells/add", &controllers.SpellsController{}, "post:Add")

	beego.Router("/track", &placon.WebSocketController{})
	beego.Router("/track/watch", &placon.WebSocketController{}, "get:Watch")
	beego.Router("/track/master", &placon.WebSocketController{}, "get:Master")
	beego.Router("/track/subs", &placon.WebSocketController{}, "get:Subs")
	beego.Router("/track/join", &placon.WebSocketController{}, "get:Join")
	beego.Router("/track/joinm", &placon.WebSocketController{}, "get:JoinM")
}
