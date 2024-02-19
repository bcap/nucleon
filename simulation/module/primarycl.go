package module

import "time"

type PrimaryCoolantLoop struct {
	poweredModule

	Reactor        *Reactor
	SteamGenerator *SteamGenerator
}

func NewPrimaryCoolantLoop(conn *PowerConnection, r *Reactor, sg *SteamGenerator) *PrimaryCoolantLoop {
	return &PrimaryCoolantLoop{
		poweredModule:  *newPoweredModule("Primary Coolant Loop", conn, 100),
		Reactor:        r,
		SteamGenerator: sg,
	}
}

func (l *PrimaryCoolantLoop) Tick(tickNum int64, passed time.Duration) {
	l.consume(passed)
}
