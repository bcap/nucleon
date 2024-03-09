package ticker

import (
	"context"
	"errors"
	"log"
	"sync/atomic"
	"time"

	myatomic "github.com/bcap/nucleon/atomic"
)

const DefaultRate = 60.0
const DefaultSpeed = 1.0
const DefaultLimit = -1

type Tick interface {
	Tick(tickNum int64, timePassed time.Duration)
}

type Ticker struct {
	tick Tick

	started atomic.Bool
	paused  atomic.Bool

	ticksPerS     myatomic.Float64
	targetDelayNs atomic.Int64

	speed myatomic.Float64

	ticks atomic.Int64
	limit atomic.Int64
}

type Option func(*Ticker)

func WithRate(ticksPerSecond float64) Option {
	return func(t *Ticker) {
		t.SetRate(ticksPerSecond)
	}
}

func WithSpeed(speed float64) Option {
	return func(t *Ticker) {
		t.SetSpeed(speed)
	}
}

func WithLimit(ticks int64) Option {
	return func(t *Ticker) {
		t.SetLimit(ticks)
	}
}

func New(t Tick, opts ...Option) *Ticker {
	ticker := Ticker{
		tick: t,
	}
	ticker.setRate(DefaultRate, false)
	ticker.setSpeed(DefaultSpeed, false)
	ticker.SetLimit(DefaultLimit)
	for _, opt := range opts {
		opt(&ticker)
	}
	return &ticker
}

var ErrAlreadyStarted = errors.New("ticker already started")

func (t *Ticker) Run(ctx context.Context) error {
	if !t.started.CompareAndSwap(false, true) {
		return ErrAlreadyStarted
	}

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	var monitorSeconds int64 = 1
	var monitorTicks atomic.Int64
	var monitorTickProcessTimeSum atomic.Int64

	go func() {
		us := int64(time.Microsecond)
		for {
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Duration(monitorSeconds) * time.Second):
				if t.paused.Load() {
					continue
				}

				ticks := monitorTicks.Swap(0)
				var avgProcessTimeUs int64 = -1
				processTimeSum := monitorTickProcessTimeSum.Swap(0)
				if processTimeSum > 0 {
					avgProcessTimeUs = processTimeSum / ticks / us
				}
				actualRatePerS := float64(ticks) / float64(monitorSeconds)
				targetDelayUs := t.targetDelayNs.Load() / us
				usedPct := float64(avgProcessTimeUs) / float64(targetDelayUs) * 100
				log.Printf(
					"Ticks per second: %.2f/%.2f, avg tick process time: %dus/%dus (%.2f%%)",
					actualRatePerS, t.ticksPerS.Load(), avgProcessTimeUs, targetDelayUs, usedPct,
				)
			}
		}
	}()

	ticker := time.NewTicker(time.Duration(t.targetDelayNs.Load()))
	lastTickTriggered := time.Now()
	for {
		select {
		case <-ctx.Done():
			ticker.Stop()
			return nil
		case <-ticker.C:
			if t.paused.Load() {
				continue
			}

			tickNum := t.ticks.Load()
			if t.limit.Load() >= 0 && tickNum >= t.limit.Load() {
				return nil
			}

			tickTriggered := time.Now()
			timePassedSinceLastTick := tickTriggered.Sub(lastTickTriggered)

			// Adjust timePassedSinceLastTick based on speed
			speed := t.speed.Load()
			if speed != 1.0 {
				timePassedSinceLastTick = time.Duration(float64(timePassedSinceLastTick) * speed)
			}

			t.tick.Tick(tickNum, timePassedSinceLastTick)

			tickProcessTime := time.Since(tickTriggered)
			t.ticks.Add(1)
			monitorTicks.Add(1)
			monitorTickProcessTimeSum.Add(tickProcessTime.Nanoseconds())

			lastTickTriggered = tickTriggered
		}
	}
}

func (t *Ticker) Pause() {
	t.paused.CompareAndSwap(false, true)
}

func (t *Ticker) Resume() {
	t.paused.CompareAndSwap(true, false)
}

func (t *Ticker) SetRate(ticksPerSecond float64) {
	t.setRate(ticksPerSecond, true)
}

func (t *Ticker) setRate(ticksPerSecond float64, logChange bool) {
	t.ticksPerS.Store(ticksPerSecond)
	targetDelayNs := time.Duration(1.0 / ticksPerSecond * float64(time.Second))
	t.targetDelayNs.Store(targetDelayNs.Nanoseconds())
	if logChange {
		log.Printf("rate set to %.2f ticks per second. Ticks can take up to %dus to run", ticksPerSecond, targetDelayNs/time.Microsecond)
	}
}

func (t *Ticker) SetSpeed(speed float64) {
	t.setSpeed(speed, true)
}

func (t *Ticker) setSpeed(speed float64, logChange bool) {
	t.speed.Store(speed)
	if logChange {
		log.Printf("speed set to %.2f", speed)
	}
}

func (t *Ticker) SetLimit(limit int64) {
	t.limit.Store(limit)
}

func (t *Ticker) Started() bool {
	return t.started.Load()
}

func (t *Ticker) Paused() bool {
	return t.paused.Load()
}

func (t *Ticker) Ticks() int64 {
	return t.ticks.Load()
}

func (t *Ticker) Rate() float64 {
	return t.ticksPerS.Load()
}

func (t *Ticker) Speed() float64 {
	return t.speed.Load()
}
