package controllers

import (
	"github.com/Penun/ddutil/models"
	"github.com/astaxie/beego"
    "encoding/json"
)

type SpellsController struct {
	beego.Controller
}

type GetSpeResp struct {
    Occ BaseResp `json:"occ"`
    Spells []models.Spell `json:"spells"`
}

type InsSpeReq struct {
	Spell models.Spell `json:"spell"`
}

type InsSpeResp struct{
	Occ BaseResp `json:"occ"`
    Spell models.Spell `json:"spell"`
}

func (this *SpellsController) Get() {
    resp := GetSpeResp{Occ: BaseResp{Success: false, Error: ""}}
	var t_spec []models.Spell
    t_spec = models.GetSpells()
	if len(t_spec) > 0{
		resp.Occ.Success = true
		resp.Spells = t_spec
	} else {
		resp.Occ.Error = "None found."
	}
    this.Data["json"] = resp
    this.ServeJSON()
}

func (this *SpellsController) Add() {
	var insReq InsSpeReq
	err := json.Unmarshal(this.Ctx.Input.RequestBody, &insReq)
	resp := InsSpeResp{Occ: BaseResp{Success: false, Error: ""}}
	if err == nil {
		sp_id := models.AddSpell(insReq.Spell)
        if sp_id > 0 {
	        insReq.Spell.Id = sp_id
            resp.Spell = insReq.Spell
            resp.Occ.Success = true
        } else {
            resp.Occ.Error = "Failed to insert."
        }
	} else {
		resp.Occ.Error = "Failed Parse." + err.Error()
	}
	this.Data["json"] = resp
	this.ServeJSON()
}
