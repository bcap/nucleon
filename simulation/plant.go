package simulation

import (
	"time"
)

type Simulation struct {
	Reactor              *Reactor
	PrimaryCoolantLoop   *PrimaryCoolantLoop
	Pressurizer          *Pressurizer
	SteamGenerator       *SteamGenerator
	SecondaryCoolantLoop *SecondaryCoolantLoop
	Condenser            *Condenser
	Turbine              *Turbine
	Generator            *Generator
	PowerGrid            *PowerGrid
	AuxiliaryGenerator   *AuxiliaryGenerator
}

func New() *Simulation {
	powerGrid := NewPowerGrid()
	reactor := NewReactor()
	steamGenerator := NewSteamGenerator()
	turbine := NewTurbine(steamGenerator)
	generator := NewGenerator(turbine)
	condenser := NewCondenser()
	pcl := NewPrimaryCoolantLoop(reactor, steamGenerator)
	scl := NewSecondaryCoolantLoop(steamGenerator, condenser)
	pressurizer := NewPressurizer(pcl)
	auxiliaryGenerator := NewAuxiliaryGenerator()
	return &Simulation{
		Reactor:              reactor,
		PrimaryCoolantLoop:   pcl,
		Pressurizer:          pressurizer,
		SteamGenerator:       steamGenerator,
		SecondaryCoolantLoop: scl,
		Condenser:            condenser,
		Turbine:              turbine,
		Generator:            generator,
		PowerGrid:            powerGrid,
		AuxiliaryGenerator:   auxiliaryGenerator,
	}
}

func (p *Simulation) Tick(tickNum int64, passed time.Duration) {
	p.Reactor.Tick(tickNum, passed)
	p.PrimaryCoolantLoop.Tick(tickNum, passed)
	p.Pressurizer.Tick(tickNum, passed)
	p.SteamGenerator.Tick(tickNum, passed)
	p.SecondaryCoolantLoop.Tick(tickNum, passed)
	p.Turbine.Tick(tickNum, passed)
	p.Generator.Tick(tickNum, passed)
	p.PowerGrid.Tick(tickNum, passed)
	p.Condenser.Tick(tickNum, passed)
	p.AuxiliaryGenerator.Tick(tickNum, passed)
}
