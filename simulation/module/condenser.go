package module

import "time"

type Condenser struct {
	poweredModule
}

func NewCondenser(conn *PowerConnection) *Condenser {
	return &Condenser{
		poweredModule: *newPoweredModule("Condenser", conn, 100),
	}
}

func (c *Condenser) Tick(tickNum int64, passed time.Duration) {
	c.consume(passed)
}
