package simulation

type module struct {
	name string
}

func newModule(name string) *module {
	return &module{name: name}
}

func (m *module) Name() string {
	return m.name
}

type Named interface {
	Name() string
}
