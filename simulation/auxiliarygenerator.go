package simulation

import "time"

type AuxiliaryGenerator struct {
	module

	output *PowerDistributer
}

func NewAuxiliaryGenerator() *AuxiliaryGenerator {
	return &AuxiliaryGenerator{
		module: *newModule("Auxiliary Generator"),
	}
}

func (g *AuxiliaryGenerator) Connect(d *PowerDistributer) {
	g.output = d
}

func (g *AuxiliaryGenerator) Tick(tickNum int64, passed time.Duration) {

}
