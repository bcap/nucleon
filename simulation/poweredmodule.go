package simulation

import (
	"log"
	"time"
)

type poweredModule struct {
	module

	demandWatts watts
	battery     joules

	on      bool
	powered bool
}

func newPoweredModule(name string, demand watts) *poweredModule {
	return &poweredModule{
		module:      *newModule(name),
		demandWatts: demand,
	}
}

func (m *poweredModule) Powered() bool {
	return m.powered
}

func (m *poweredModule) Demand() watts {
	if !m.on {
		return 0
	}
	return m.demandWatts
}

func (m *poweredModule) Feed(joules joules) {
	if !m.on {
		return
	}
	m.battery += joules
}

func (m *poweredModule) Tick(tickNum int64, passed time.Duration) {
	if !m.on {
		if m.battery != 0 {
			m.battery = 0
		}
		return
	}

	joules := float64(m.demandWatts) * passed.Seconds()
	m.battery -= joules
	if m.battery < 0 {
		m.battery = 0
		if m.powered {
			log.Printf("Module %s is offline", m.Name)
			m.powered = false
		}
	} else if !m.powered {
		m.powered = true
		log.Printf("Module %s is online", m.Name)
	}
}
