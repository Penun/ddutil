package sockets

type EventType int

const (
	EVENT_JOIN = iota
	EVENT_LEAVE
	EVENT_NOTE
	EVENT_LONG
	EVENT_HP
	EVENT_INIT
	EVENT_INIT_D
	EVENT_INIT_S
	EVENT_INIT_T
)

type Event struct {
	Type EventType `json:"type"` // JOIN, LEAVE, NOTE
	Sender Sender `json:"sender"`
	Targets []string `json:"targets"`
	Data string `json:"data"`
}

type Player struct {
    Name string `json:"name"`
	HP int `json:"hp"`
	Initiative int `json:"initiative"`
}

type Sender struct {
	Name string `json:"name"`
	Type string `json:"type"`
}
