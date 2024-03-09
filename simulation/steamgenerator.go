package simulation

import "time"

type SteamGenerator struct {
	poweredModule
}

func NewSteamGenerator() *SteamGenerator {
	return &SteamGenerator{
		poweredModule: *newPoweredModule("Steam Generator", 100),
	}
}

func (s *SteamGenerator) Tick(tickNum int64, passed time.Duration) {
	s.poweredModule.Tick(tickNum, passed)
}
