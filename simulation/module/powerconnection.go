package module

type PowerConnection struct {
	Drain         *PowerConnection
	CurrentJoules float64
	MaxJoules     float64
}

func NewPowerConnection(drain *PowerConnection, maxJoules float64) *PowerConnection {
	return &PowerConnection{
		Drain:     drain,
		MaxJoules: maxJoules,
	}
}
