package simulation

import (
	"sort"
	"time"
)

type PowerDistributer struct {
	priorities []int
	targets    map[int][]*poweredModule
}

func NewPowerDistributer() *PowerDistributer {
	return &PowerDistributer{
		priorities: make([]int, 0),
		targets:    make(map[int][]*poweredModule, 0),
	}
}

func (p *PowerDistributer) Connect(priority int, target *poweredModule) {
	targets, ok := p.targets[priority]
	if !ok {
		p.priorities = append(p.priorities, priority)
		sort.Ints(p.priorities)
	}
	targets = append(targets, target)
	p.targets[priority] = targets
}

// Returns the total demand and the demand broken down by priority
func (p *PowerDistributer) Demand() (watts, map[int]watts) {
	demandPerPri := map[int]watts{}
	var totalDemand watts
	for pri, priTargets := range p.targets {
		for _, target := range priTargets {
			demand := target.Demand()
			demandPerPri[pri] += demand
			totalDemand += demand
		}
	}
	return totalDemand, demandPerPri
}

// Feeds energy to targets in a prioritized fashion.
// The higher priority targets are fed entirely before moving to the next priority
// All targets in the same priority are fed with the same percentage of their demand
func (p *PowerDistributer) Feed(wattage watts, duration time.Duration) joules {
	// calculate total energy generated
	totalJoules := wattage * duration.Seconds()

	_, demands := p.Demand()

	// start feeding energy to targets based on priority
	for _, pri := range p.priorities {
		// no more remaining energy, no point in continuing
		if totalJoules == 0 {
			break
		}

		// total demand for this priority
		demand := demands[pri]

		// total joules needed to feed targets at this priority
		joules := demand * duration.Seconds()

		// substract the energy needed for this priority from the total energy generated
		if joules > totalJoules {
			joules = totalJoules
			totalJoules = 0
		} else {
			totalJoules -= joules
		}

		// distribute energy between targets. All targets get the same percentage of their demand
		targets := p.targets[pri]
		shares := make([]float64, len(targets))
		for idx, target := range targets {
			shares[idx] = target.Demand() / demand
		}
		for idx, target := range targets {
			target.Feed(joules * shares[idx])
		}
	}

	// return unused energy
	return totalJoules
}
