package simulation

import "time"

type Pressurizer struct {
	poweredModule
	PrimaryCoolantLoop *PrimaryCoolantLoop
}

func NewPressurizer(l *PrimaryCoolantLoop) *Pressurizer {
	return &Pressurizer{
		poweredModule:      *newPoweredModule("Pressurizer", 400),
		PrimaryCoolantLoop: l,
	}
}

func (l *Pressurizer) Tick(tickNum int64, passed time.Duration) {
	l.poweredModule.Tick(tickNum, passed)
}
