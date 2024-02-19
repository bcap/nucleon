package module

import "time"

type Generator struct {
	Turbine *Turbine
	Output  *PowerConnection
}

func NewGenerator(turbine *Turbine, output *PowerConnection) *Generator {
	return &Generator{
		Turbine: turbine,
		Output:  output,
	}
}

func (g *Generator) Tick(tickNum int64, passed time.Duration) {

}
