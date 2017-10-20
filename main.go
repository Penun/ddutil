package main

import (
	_ "github.com/Penun/ddutil/routers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRMySQL)
	dbUser := beego.AppConfig.String("mysqluser")
	dbPass := beego.AppConfig.String("mysqlpass")
	dbInitial := beego.AppConfig.String("mysqldb")
	orm.RegisterDataBase("default", "mysql", dbUser + ":" + dbPass + "@/" + dbInitial + "?charset=utf8")
}

func main() {
	orm.Debug = true
	beego.Run()
}
