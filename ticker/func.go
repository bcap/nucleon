package ticker

import "time"

type tickerFunc struct {
	fn func(int64, time.Duration)
}

func (t tickerFunc) Tick(tickNum int64, timePassed time.Duration) {
	t.fn(tickNum, timePassed)
}

func TickerFunc(fn func(int64, time.Duration)) Tick {
	return tickerFunc{fn: fn}
}
