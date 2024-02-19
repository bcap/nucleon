package module

import "time"

type Pressurizer struct {
	poweredModule
	PrimaryCoolantLoop *PrimaryCoolantLoop
}

func NewPressurizer(conn *PowerConnection, l *PrimaryCoolantLoop) *Pressurizer {
	return &Pressurizer{
		poweredModule:      *newPoweredModule("Pressurizer", conn, 400),
		PrimaryCoolantLoop: l,
	}
}

func (l *Pressurizer) Tick(tickNum int64, passed time.Duration) {
	l.consume(passed)
}
