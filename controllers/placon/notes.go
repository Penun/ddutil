package placon

import (
    "encoding/json"
    "github.com/Penun/ddutil/models/sockets"
)

type Note struct {
    Players []string `json:"players"`
    Message string `json:"message"`
}

func HandleNote(uname string, ws_type string, data string) {
    var parsDat Note
    err := json.Unmarshal([]byte(data), &parsDat)
    if err == nil {
        publish <- newEvent(sockets.EVENT_NOTE, uname, ws_type, parsDat.Players, parsDat.Message)
    }
}
