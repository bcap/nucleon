package simulation

import "time"

type Generator struct {
	module

	Turbine *Turbine
	output  *PowerDistributer
}

func NewGenerator(turbine *Turbine) *Generator {
	return &Generator{
		module:  *newModule("Generator"),
		Turbine: turbine,
	}
}

func (g *Generator) Connect(d *PowerDistributer) {
	g.output = d
}

func (g *Generator) Tick(tickNum int64, passed time.Duration) {

}
