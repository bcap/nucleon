package simulation

import "time"

type PrimaryCoolantLoop struct {
	poweredModule

	Reactor        *Reactor
	SteamGenerator *SteamGenerator
}

func NewPrimaryCoolantLoop(r *Reactor, sg *SteamGenerator) *PrimaryCoolantLoop {
	return &PrimaryCoolantLoop{
		poweredModule:  *newPoweredModule("Primary Coolant Loop", 100),
		Reactor:        r,
		SteamGenerator: sg,
	}
}

func (l *PrimaryCoolantLoop) Tick(tickNum int64, passed time.Duration) {
	l.poweredModule.Tick(tickNum, passed)
}
