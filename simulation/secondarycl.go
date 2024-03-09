package simulation

import "time"

type SecondaryCoolantLoop struct {
	poweredModule

	SteamGenerator *SteamGenerator
	Condenser      *Condenser
}

func NewSecondaryCoolantLoop(sg *SteamGenerator, c *Condenser) *SecondaryCoolantLoop {
	return &SecondaryCoolantLoop{
		poweredModule:  *newPoweredModule("Secondary Coolant Loop", 100),
		SteamGenerator: sg,
		Condenser:      c,
	}
}

func (l *SecondaryCoolantLoop) Tick(tickNum int64, passed time.Duration) {
	l.poweredModule.Tick(tickNum, passed)
}
