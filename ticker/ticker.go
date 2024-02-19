package ticker

import (
	"context"
	"log"
	"sync/atomic"
	"time"
)

type Tick interface {
	Tick(tickNum int64, timePassed time.Duration)
}

func Run(ctx context.Context, targetRatePerS float64, t Tick) {
	targetDelay := time.Duration(1.0 / targetRatePerS * float64(time.Second))
	ticker := time.NewTicker(targetDelay)
	log.Printf("running at %0.2f ticks per second. Ticks can take up to %dus to run", targetRatePerS, targetDelay/time.Microsecond)

	var monitorSeconds int64 = 5
	var monitorTicks atomic.Int64
	var monitorTickProcessTimeSum atomic.Int64

	go func() {
		us := int64(time.Microsecond)
		for {
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Duration(monitorSeconds) * time.Second):
				ticks := monitorTicks.Swap(0)
				var avgProcessTimeUs int64 = -1
				processTimeSum := monitorTickProcessTimeSum.Swap(0)
				if processTimeSum > 0 {
					avgProcessTimeUs = processTimeSum / ticks / us
				}
				actualRatePerS := float64(ticks) / float64(monitorSeconds)
				targetDelayUs := targetDelay.Nanoseconds() / us
				usedPct := float64(avgProcessTimeUs) / float64(targetDelayUs) * 100
				log.Printf(
					"Ticks per second: %.2f/%.2f, avg tick process time: %dus/%dus (%.2f%%)",
					actualRatePerS, targetRatePerS, avgProcessTimeUs, targetDelayUs, usedPct,
				)
			}
		}
	}()

	var tickNum int64
	lastTickTriggered := time.Now()
	for {
		select {
		case <-ctx.Done():
			ticker.Stop()
			return
		case <-ticker.C:
			tickTriggered := time.Now()
			timePassedSinceLastTick := tickTriggered.Sub(lastTickTriggered)

			t.Tick(tickNum, timePassedSinceLastTick)

			tickProcessTime := time.Since(tickTriggered)

			tickNum++
			monitorTicks.Add(1)
			monitorTickProcessTimeSum.Add(tickProcessTime.Nanoseconds())

			lastTickTriggered = tickTriggered
		}
	}
}
