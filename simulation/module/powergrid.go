package module

import "time"

type PowerGrid struct {
	PowerConnection *PowerConnection
}

func NewPowerGrid(conn *PowerConnection) *PowerGrid {
	return &PowerGrid{
		PowerConnection: conn,
	}
}

func (p *PowerGrid) Tick(tickNum int64, passed time.Duration) {

}
