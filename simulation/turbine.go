package simulation

import "time"

type Turbine struct {
	SteamGenerator *SteamGenerator
}

func NewTurbine(sg *SteamGenerator) *Turbine {
	return &Turbine{
		SteamGenerator: sg,
	}
}

func (t *Turbine) Tick(tickNum int64, passed time.Duration) {

}
