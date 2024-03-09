package simulation

import (
	"log"
	"math"
	"time"

	myatomic "github.com/bcap/nucleon/atomic"
)

type Reactor struct {
	poweredModule
	sixFactor

	ControlRodPosition float64
	ControlRodSpeed    float64

	DesiredControlRodPosition float64

	Reactivity  float64
	NeutronFlux float64

	GenerationLifeCycle time.Duration
}

// Six factor formula
//
// keff = η . ε . p . f . Pf . Pt
//   │    │   │   │   │   │    │
//   │    │   │   │   │   │    └──► Pt:		Thermal Non-leakage Probability: 	probability of thermal neutrons not leaving the core
//   │    │   │   │   │   └───────► Pf:		Fast Non-leakage Probability: 		probability of fast neutrons not leaving the core
//   │    │   │   │   └───────────► f:		Thermal Utilization Factor: 		probability of thermal neutrons being absorved by the fuel
//   │    │   │   └───────────────► p:		Resonance Escape Probability: 		probability of neutrons escaping resonance capture from other nuclei than U235
//   │    │   └───────────────────► ε:		Fast Fission Factor: 				probability of fission from fast neutrons
//   │    └───────────────────────► η:		Reproduction Factor: 				how many neutrons are produced per fission
//   └────────────────────────────► keff:	Effective Multiplication Factor
//
//
//   Example of Neutron Lifecycle with kEff ~= 1
//
//       ┌─────────────────────┐  1000 neutrons  ┌──────────────┐
//       │ reproduction factor ├────────────────►│ fast fission │
//       │    2.02             │                 │    1.03      │
//       └─────────────────────┘                 └──────┬───────┘
//              ▲                                       │ 1030 neutrons
//              │ 495 neutrons                          ▼
//       ┌──────┴──────────────┐                 ┌──────────────────┐
//       │ thermal utilization │                 │ fast non-leakage │ 51 neutrons leaked
//       │    0.70             │                 │    0.95          ├───────►
//       └─────────────────────┘                 └──────┬───────────┘
//              ▲                                       │ 979 neutrons
//              │ 705 neutrons                          ▼
//       ┌──────┴──────────────┐                 ┌──────────────────┐
//       │ thermal non leakage │  734 neutrons   │ resonance escape │
//       │    0.96             │◄────────────────┤    0.75          │
//       └──────┬──────────────┘                 └──────────────────┘
//              │ 21 neutrons leaked
//              ▼
//
// https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/six-factor-formula-effective-multiplication-factor/

type sixFactor struct {
	reproductionFactor  myatomic.Float64 // η
	fastFissionP        myatomic.Float64 // ε
	resonanceEscapeP    myatomic.Float64 // p
	thermalUtilizationP myatomic.Float64 // f
	fastNonLeakageP     myatomic.Float64 // Pf
	thermalNonLeakageP  myatomic.Float64 // Pt
}

func NewReactor() *Reactor {
	reactor := Reactor{
		poweredModule:       *newPoweredModule("Reactor", 100),
		GenerationLifeCycle: 100 * time.Millisecond, // median generation lifecyle is of 0.1 seconds
		NeutronFlux:         1000,
	}

	reactor.fastFissionP.Store(1.03)
	reactor.fastNonLeakageP.Store(0.95)
	reactor.resonanceEscapeP.Store(0.75)
	reactor.thermalNonLeakageP.Store(0.96)
	reactor.thermalUtilizationP.Store(0.70)
	reactor.reproductionFactor.Store(2.03)

	return &reactor
}

func (r *Reactor) Tick(tickNum int64, passed time.Duration) {
	r.poweredModule.Tick(tickNum, passed)

	hasPower := r.Powered()
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

	// Calculate how many generation runs we would have with the passed time
	runs := float64(passed.Microseconds()) / float64(r.GenerationLifeCycle.Microseconds())
	kEff, reactivity := r.sixFactor.calcReactivity()
	r.Reactivity = reactivity
	timedSixFactor := math.Pow(1+kEff, runs)

	r.NeutronFlux *= timedSixFactor

	log.Printf("neutron flux: %d, reactivity: %f", int64(r.NeutronFlux), r.Reactivity)
}

func (s *sixFactor) calcReactivity() (kEff, reactivity) {
	kEff := s.fastFissionP.Load() *
		s.fastNonLeakageP.Load() *
		s.resonanceEscapeP.Load() *
		s.thermalNonLeakageP.Load() *
		s.thermalUtilizationP.Load() *
		s.reproductionFactor.Load()
	reactivity := (kEff - 1) / kEff
	return kEff, reactivity
}
