package ticker

import (
	"math"
	"sync/atomic"
)

type Float64 struct {
	v atomic.Uint64
}

func (f *Float64) Load() float64 {
	return math.Float64frombits(f.v.Load())
}

func (f *Float64) Store(val float64) {
	f.v.Store(math.Float64bits(val))
}

func (f *Float64) Swap(val float64) (old float64) {
	return math.Float64frombits(f.v.Swap(math.Float64bits(val)))
}
