package module

import "time"

type AuxiliaryGenerator struct {
	Output *PowerConnection
}

func NewAuxiliaryGenerator(output *PowerConnection) *AuxiliaryGenerator {
	return &AuxiliaryGenerator{
		Output: output,
	}
}

func (g *AuxiliaryGenerator) Tick(tickNum int64, passed time.Duration) {

}
