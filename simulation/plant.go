package simulation

import (
	"time"

	"github.com/bcap/nucleon/simulation/module"
)

type Simulation struct {
	Reactor                 *module.Reactor
	PrimaryCoolantLoop      *module.PrimaryCoolantLoop
	Pressurizer             *module.Pressurizer
	SteamGenerator          *module.SteamGenerator
	SecondaryCoolantLoop    *module.SecondaryCoolantLoop
	Condenser               *module.Condenser
	Turbine                 *module.Turbine
	Generator               *module.Generator
	MainPowerConnection     *module.PowerConnection
	InternalPowerConnection *module.PowerConnection
	PowerGrid               *module.PowerGrid
	AuxiliaryGenerator      *module.AuxiliaryGenerator
}

func New() *Simulation {
	mainPowerConnection := module.NewPowerConnection(nil, 100)
	internalPowerConnection := module.NewPowerConnection(mainPowerConnection, 100)
	powerGrid := module.NewPowerGrid(mainPowerConnection)
	reactor := module.NewReactor(internalPowerConnection)
	steamGenerator := module.NewSteamGenerator(internalPowerConnection)
	turbine := module.NewTurbine(steamGenerator)
	generator := module.NewGenerator(turbine, mainPowerConnection)
	condenser := module.NewCondenser(internalPowerConnection)
	pcl := module.NewPrimaryCoolantLoop(internalPowerConnection, reactor, steamGenerator)
	scl := module.NewSecondaryCoolantLoop(internalPowerConnection, steamGenerator, condenser)
	pressurizer := module.NewPressurizer(internalPowerConnection, pcl)
	auxiliaryGenerator := module.NewAuxiliaryGenerator(internalPowerConnection)
	return &Simulation{
		Reactor:                 reactor,
		PrimaryCoolantLoop:      pcl,
		Pressurizer:             pressurizer,
		SteamGenerator:          steamGenerator,
		SecondaryCoolantLoop:    scl,
		Condenser:               condenser,
		Turbine:                 turbine,
		Generator:               generator,
		MainPowerConnection:     mainPowerConnection,
		InternalPowerConnection: internalPowerConnection,
		PowerGrid:               powerGrid,
		AuxiliaryGenerator:      auxiliaryGenerator,
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
