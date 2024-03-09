package simulation

import "time"

type PowerGrid struct {
	module
}

func NewPowerGrid() *PowerGrid {
	return &PowerGrid{
		module: *newModule("Power Grid"),
	}
}

func (p *PowerGrid) Tick(tickNum int64, passed time.Duration) {

}
