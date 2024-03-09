package simulation

import "time"

type Condenser struct {
	poweredModule
}

func NewCondenser() *Condenser {
	return &Condenser{
		poweredModule: *newPoweredModule("Condenser", 100),
	}
}

func (c *Condenser) Tick(tickNum int64, passed time.Duration) {
	c.poweredModule.Tick(tickNum, passed)
}
