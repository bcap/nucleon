package module

import (
	"log"
	"time"
)

type module struct {
	Name string
}

func newModule(name string) *module {
	return &module{Name: name}
}

type poweredModule struct {
	module

	DemandWatts   int
	InternalPower *PowerConnection

	powered bool
}

func newPoweredModule(name string, conn *PowerConnection, demandWatts int) *poweredModule {
	return &poweredModule{
		module:        *newModule(name),
		DemandWatts:   demandWatts,
		InternalPower: conn,
	}
}

func (m *poweredModule) Powered() bool {
	return m.powered
}

func (m *poweredModule) consume(passed time.Duration) bool {
	joules := float64(m.DemandWatts) * passed.Seconds()
	if joules <= m.InternalPower.CurrentJoules {
		m.InternalPower.CurrentJoules -= joules
		if !m.powered {
			log.Printf("Module %s is online", m.Name)
			m.powered = true
		}
	} else if m.powered {
		log.Printf("Module %s is offline", m.Name)
		m.powered = false
	}
	return m.powered
}
