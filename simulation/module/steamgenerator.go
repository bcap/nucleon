package module

import "time"

type SteamGenerator struct {
	poweredModule
}

func NewSteamGenerator(conn *PowerConnection) *SteamGenerator {
	return &SteamGenerator{
		poweredModule: *newPoweredModule("Steam Generator", conn, 100),
	}
}

func (s *SteamGenerator) Tick(tickNum int64, passed time.Duration) {
	s.consume(passed)
}
