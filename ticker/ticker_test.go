package ticker

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type stopwatch struct {
	duration time.Duration
	ticked   int64
	ticks    []int64
}

func newStopwatch() *stopwatch {
	return &stopwatch{
		ticks: []int64{},
	}
}

func (s *stopwatch) Tick(tickNum int64, timePassed time.Duration) {
	s.duration += timePassed
	s.ticks = append(s.ticks, tickNum)
	s.ticked++
}

func (s *stopwatch) AssertSequence(t *testing.T, numTicks int64) {
	if numTicks >= 0 {
		assert.Equal(t, numTicks, s.ticked)
		assert.Equal(t, int(numTicks), len(s.ticks))
	}
	for i, tick := range s.ticks {
		assert.Equal(t, int64(i), tick)
	}
}

func TestNoOp(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	sw := newStopwatch()
	ticker := New(sw, WithLimit(0))
	ticker.Run(ctx)
	sw.AssertSequence(t, 0)
	assert.Equal(t, time.Duration(0), sw.duration)
}

func TestLimit(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	ticks := int64(250)

	sw := newStopwatch()
	ticker := New(sw, WithRate(1000), WithLimit(ticks))
	ticker.Run(ctx)
	sw.AssertSequence(t, ticks)

	fmt.Println(sw.duration)
	assert.Greater(t, sw.duration, time.Duration(0))
}

func TestTiming(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 10 ticks at 100 ticks per second => 100ms
	ticks := int64(10)
	ticksPerSecond := 100.0

	sw := newStopwatch()
	ticker := New(sw, WithRate(ticksPerSecond), WithLimit(ticks))
	ticker.Run(ctx)
	sw.AssertSequence(t, ticks)

	fmt.Println(sw.duration)
	assert.Greater(t, sw.duration, 100*time.Millisecond)
	assert.Less(t, sw.duration, 103*time.Millisecond) // 3% error margin
}

func TestSpeed(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 10 ticks at 100 ticks per second is 100ms
	// At speed of 2x then the time perception of 100ms becomes 200ms
	ticks := int64(10)
	ticksPerSecond := 100.0
	speed := 2.0

	sw := newStopwatch()
	ticker := New(sw, WithRate(ticksPerSecond), WithLimit(ticks), WithSpeed(speed))
	ticker.Run(ctx)
	sw.AssertSequence(t, ticks)

	fmt.Println(sw.duration)
	assert.Greater(t, sw.duration, 200*time.Millisecond)
	assert.Less(t, sw.duration, 206*time.Millisecond) // 3% error margin
}

func TestCancelation(t *testing.T) {
	ticksPerSecond := 100.0

	sw := newStopwatch()
	ticker := New(sw, WithRate(ticksPerSecond))

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	ticker.Run(ctx)

	sw.AssertSequence(t, -1)

	fmt.Println(sw.duration)
	assert.Greater(t, sw.duration, 80*time.Millisecond)
	assert.Less(t, sw.duration, 103*time.Millisecond)
}
