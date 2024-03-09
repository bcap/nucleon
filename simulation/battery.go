package simulation

import "time"

type Battery struct {
	module
}

func NewBattery(capacity joules) *Condenser {
	return &Condenser{
		poweredModule: *newPoweredModule("Battery", capacity),
	}
}

func (c *Battery) Tick(tickNum int64, passed time.Duration) {

}
