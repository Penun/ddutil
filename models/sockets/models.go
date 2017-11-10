package sockets

type EventType int

const (
	EVENT_JOIN = iota
	EVENT_LEAVE
	EVENT_NOTE
	EVENT_LONG
)

type Event struct {
	Type EventType `json:"type"` // JOIN, LEAVE, NOTE
	Player Player `json:"player"`
	Targets []string `json:"targets"`
	Data string `json:"data"`
}

type Player struct {
    Name string `json:"name"`
    Type string `json:"type"`
}
