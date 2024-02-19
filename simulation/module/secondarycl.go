package module

import "time"

type SecondaryCoolantLoop struct {
	poweredModule

	SteamGenerator *SteamGenerator
	Condenser      *Condenser
}

func NewSecondaryCoolantLoop(conn *PowerConnection, sg *SteamGenerator, c *Condenser) *SecondaryCoolantLoop {
	return &SecondaryCoolantLoop{
		poweredModule:  *newPoweredModule("Secondary Coolant Loop", conn, 100),
		SteamGenerator: sg,
		Condenser:      c,
	}
}

func (l *SecondaryCoolantLoop) Tick(tickNum int64, passed time.Duration) {
	l.consume(passed)
}
