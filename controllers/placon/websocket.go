package placon

import (
	"time"
	"encoding/json"
	"strconv"
	"net/http"
	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
	"github.com/Penun/ddutil/models/sockets"
)

// WebSocketController handles WebSocket requests.
type WebSocketController struct {
	beego.Controller
}

type GetSubsResp struct {
	Success bool `json:"success"`
    Result []*sockets.Player `json:"result"`
}

type ControllerReq struct {
	Type string `json:"type"`
	Data MultiMess `json:"data"`
}

type MultiMess struct {
    Players []string `json:"players"`
    Message string `json:"message"`
}

type SocketMessage struct {
	Type sockets.EventType `json:"type"`
	Player sockets.Sender `json:"player"`
	Data string `json:"data"`
}

type SocketWatchMessage struct {
	Type sockets.EventType `json:"type"`
	Player sockets.Sender `json:"player"`
	Players []string `json:"players"`
	Data string `json:"data"`
}

var (
	players = make([]*sockets.Player, 0)
	master = false
)

func (this *WebSocketController) Get() {
	this.TplName = "placon/index.tpl"
}

func (this *WebSocketController) Watch() {
	this.TplName = "placon/watch.tpl"
}

func (this *WebSocketController) Master() {
	this.TplName = "placon/master.tpl"
}

// Join method handles WebSocket requests for WebSocketController.
func (this *WebSocketController) Join() {
	uname := ""
	ws_type := this.GetString("type")
	if ws_type == "play" || ws_type == "master" {
		uname = this.GetString("uname")
		if len(uname) == 0 {
			this.Redirect("/", 302)
			return
		}
		for _, sub := range subscribers {
			if sub.Name == uname {
				this.Redirect("/", 302)
				return
			}
		}
	} else if ws_type == "watch" {
		uname = "watch" + strconv.FormatInt(time.Now().Unix(), 10)
	} else {
		this.Redirect("/", 302)
		return
	}

	//this.TplName = "placon/end.html"

	// Upgrade from http request to WebSocket.
	ws, err := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(this.Ctx.ResponseWriter, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		beego.Error("Cannot setup WebSocket connection:", err)
		return
	}

	// Join update channel.
	Join(uname, ws_type, ws)

	var curPlay sockets.Player
	if ws_type == "play" {
		curPlay = sockets.Player{uname, 0, 0}
		players = append(players, &curPlay)
	}

	defer SetupLeave(uname, curPlay)

	// Message receive loop.
	for {
		_, req, err := ws.ReadMessage()
		if err != nil {
			return
		}

		var conReq ControllerReq
		err = json.Unmarshal(req, &conReq)
		if err == nil {
			switch conReq.Type {
			case "note":
				publish <- newEvent(sockets.EVENT_NOTE, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "longrest":
				publish <- newEvent(sockets.EVENT_LONG, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "hp":
				hp, _ := strconv.Atoi(conReq.Data.Message)
				if ws_type == "play" {
					curPlay.HP += hp
				} else {
					for i := 0; i < len(conReq.Data.Players); i++ {
						for j := 0; j < len(players); j++ {
							if (players[j].Name == conReq.Data.Players[i]){
								players[j].HP += hp;
								break;
							}
						}
					}
				}
				publish <- newEvent(sockets.EVENT_HP, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "initiative":
				init, _ := strconv.Atoi(conReq.Data.Message)
				curPlay.Initiative = init
				publish <- newEvent(sockets.EVENT_INIT, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "initiative_d":
				for i := 0; i < len(conReq.Data.Players); i++ {
					for j := 0; j < len(players); j++ {
						if (players[j].Name == conReq.Data.Players[i]){
							players[j].Initiative = 0;
							break;
						}
					}
				}
				publish <- newEvent(sockets.EVENT_INIT_D, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			}
		} else {
			beego.Error(err.Error())
		}
	}
	return
}

func (this *WebSocketController) Subs() {
	resp := GetSubsResp{Success: false}
	if sub_len := len(players); sub_len > 0 {
		resp.Result = players
		resp.Success = true
	}
	this.Data["json"] = resp
	this.ServeJSON()
}

// broadcastWebSocket broadcasts messages to WebSocket users.
func broadcastWebSocket(event sockets.Event) {
	for i := 0; i < len(subscribers); i++ {
		send := false
		watch := subscribers[i].Type == "watch"
		switch event.Type {
		case sockets.EVENT_JOIN:
			send = true
		case sockets.EVENT_LEAVE:
			send = true
		case sockets.EVENT_NOTE:
			send = FindInSlice(event.Targets, subscribers[i])
		case sockets.EVENT_LONG:
			send = FindInSlice(event.Targets, subscribers[i])
		case sockets.EVENT_INIT_D:
			if watch {
				send = true
			} else {
				send = FindInSlice(event.Targets, subscribers[i])
			}
		case sockets.EVENT_HP:
			if watch {
				send = true
			} else {
				send = FindInSlice(event.Targets, subscribers[i])
			}
		case sockets.EVENT_INIT:
			if watch {
				send = true
			}
		}

		if send {
			var data []byte
			if !watch {
				sockMes := SocketMessage{Type: event.Type, Player: event.Sender, Data: event.Data}
				data, _ = json.Marshal(sockMes)
			} else {
				sockMes := SocketWatchMessage{Type: event.Type, Player: event.Sender, Players: event.Targets, Data: event.Data}
				data, _ = json.Marshal(sockMes)
			}
			if len(data) == 0 {
				return
			}
			ws := subscribers[i].Conn
			if ws != nil {
				if ws.WriteMessage(websocket.TextMessage, data) != nil {
					// User disconnected.
					unsubscribe <- subscribers[i].Name
				}
			}
		}
	}
}

func SetupLeave(uname string, play sockets.Player) {
	Leave(uname)
	playLen := len(players)
	for i := 0; i < playLen; i++ {
		if players[i].Name == play.Name {
			if i == playLen - 1 {
				players = players[:playLen-1]
			} else {
				players = append(players[:i], players[i+1:]...)
			}
		}
	}
}

func FindInSlice(targets []string, sub Subscriber) bool {
	for j := 0; j < len(targets); j++ {
		if targets[j] == sub.Name {
			return true
		}
	}
	return false
}
