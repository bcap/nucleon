package module

import (
	"log"
	"math"
	"time"
)

type Reactor struct {
	poweredModule

	ControlRodPosition float64
	ControlRodSpeed    float64

	DesiredControlRodPosition float64

	Reactivity  float64
	NeutronFlux float64

	GenerationLifeCycle time.Duration
}

func NewReactor(conn *PowerConnection) *Reactor {
	return &Reactor{
		poweredModule:       *newPoweredModule("Reactor", conn, 100),
		GenerationLifeCycle: 100 * time.Millisecond,
		NeutronFlux:         1000,
	}
}

func (r *Reactor) Tick(tickNum int64, passed time.Duration) {
	hasPower := r.consume(passed)

	if hasPower && r.DesiredControlRodPosition != r.ControlRodPosition {
		delta := r.ControlRodSpeed * float64(passed.Seconds())
		if r.DesiredControlRodPosition > r.ControlRodPosition {
			r.ControlRodPosition += delta
			if r.ControlRodPosition > r.DesiredControlRodPosition {
				r.ControlRodPosition = r.DesiredControlRodPosition
			}
		} else {
			r.ControlRodPosition -= delta
			if r.ControlRodPosition < r.DesiredControlRodPosition {
				r.ControlRodPosition = r.DesiredControlRodPosition
			}
		}
	}

	// Six factor formula
	// https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/six-factor-formula-effective-multiplication-factor/
	// https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/operational-factors/

	fastFissionP := 1.03
	fastNonLeakageP := 0.95
	resonanceEscapeP := 0.75
	thermalNonLeakageP := 0.96
	thermalUtilizationP := 0.70
	reproductionFactor := 2.03
	sixFactor := fastFissionP * fastNonLeakageP * resonanceEscapeP * thermalNonLeakageP * thermalUtilizationP * reproductionFactor

	r.Reactivity = sixFactor - 1

	// median generation lifecyle is of 0.1 seconds. Calculate how many generation runs we would have with the passed time
	runs := float64(passed.Microseconds()) / float64(r.GenerationLifeCycle.Microseconds())
	timedSixFactor := math.Pow(sixFactor, runs)

	r.NeutronFlux *= timedSixFactor

	log.Printf("neutron flux: %d, reactivity: %f", int64(r.NeutronFlux), r.Reactivity)
}
