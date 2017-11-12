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
    Result []PSub `json:"result"`
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
	Type sockets.EventType `json:"type"` // JOIN, LEAVE, NOTE
	Player sockets.Player `json:"player"`
	Data string `json:"data"`
}

type PSub struct {
	Name string `json:"name"`
    Type string `json:"type"`
    HP int `json:"hp"`
 	Initiative int `json:"initiative"`
}

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

	this.TplName = "placon/end.html"

	// Upgrade from http request to WebSocket.
	ws, err := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(this.Ctx.ResponseWriter, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		beego.Error("Cannot setup WebSocket connection:", err)
		return
	}

	// Join chat room.
	Join(uname, ws_type, ws)
	defer Leave(uname)

	// Message receive loop.
	for {
		_, req, err := ws.ReadMessage()
		if err != nil {
			return
		}

		var conReq ControllerReq
		err = json.Unmarshal(req, &conReq)
		if err == nil {
			var sub *Subscriber
			for i := 0; i < len(subscribers); i++ {
				if uname == subscribers[i].Name {
					sub = &subscribers[i]
				}
			}
			switch conReq.Type {
			case "note":
				publish <- newEvent(sockets.EVENT_NOTE, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "longrest":
				publish <- newEvent(sockets.EVENT_LONG, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "hp":
				hp, _ := strconv.Atoi(conReq.Data.Message)
				sub.Stats.HP += hp
				publish <- newEvent(sockets.EVENT_HP, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "initiative":
				init, _ := strconv.Atoi(conReq.Data.Message)
				sub.Stats.Initiative = init
				publish <- newEvent(sockets.EVENT_INIT, uname, ws_type, conReq.Data.Players, conReq.Data.Message)
			case "initiative_d":
				for i := 0; i < len(conReq.Data.Players); i++ {
					for j := 0; j < len(subscribers); j++ {
						if (subscribers[j].Name == conReq.Data.Players[i]){
							subscribers[j].Stats.Initiative = 0;
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

}

func (this *WebSocketController) Subs() {
	var subs = make([]PSub, 0)
	resp := GetSubsResp{Success: false}
	if sub_len := len(subscribers); sub_len > 0 {
		for i := 0; i < sub_len; i++ {
			if subscribers[i].Type != "watch" {
				psub := PSub{Name: subscribers[i].Name, Type: subscribers[i].Type, HP: subscribers[i].Stats.HP, Initiative: subscribers[i].Stats.Initiative}
				subs = append(subs, psub)
			}
		}
		resp.Result = subs
		resp.Success = true
	}
	this.Data["json"] = resp
	this.ServeJSON()
}

// broadcastWebSocket broadcasts messages to WebSocket users.
func broadcastWebSocket(event sockets.Event) {
	for i := 0; i < len(subscribers); i++ {
		send := false
		actPlay := false
		if event.Type == sockets.EVENT_NOTE || event.Type == sockets.EVENT_LONG || event.Type == sockets.EVENT_INIT_D {
			for j := 0; j < len(event.Targets); j++ {
				if event.Targets[j] == subscribers[i].Name {
					send = true
					break
				}
			}
			if !send && event.Type == sockets.EVENT_INIT_D && subscribers[i].Type == "watch" {
				send = true
				actPlay = true
			}
		} else if event.Type == sockets.EVENT_HP || event.Type == sockets.EVENT_INIT {
			if subscribers[i].Type == "watch" {
				send = true
			}
		} else {
			send = true
		}

		if send {
			var sockMes SocketMessage
			if !actPlay {
				sockMes = SocketMessage{Type: event.Type, Player: event.Player, Data: event.Data}
			} else {
				messageData, err := json.Marshal(event.Targets)
				if err == nil {
					sockMes = SocketMessage{Type: event.Type, Player: event.Player, Data: string(messageData)}
				} else {
					return
				}
			}
			data, err := json.Marshal(sockMes)
			if err != nil {
				beego.Error("Fail to marshal event:", err)
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
