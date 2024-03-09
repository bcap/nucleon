package main

import (
	"context"

	"github.com/bcap/nucleon/simulation"
	"github.com/bcap/nucleon/ticker"
)

func main() {
	ticksPerS := 60.0
	speed := 1.0

	ctx := context.Background()
	sim := simulation.New()
	ticker := ticker.New(sim, ticker.WithRate(ticksPerS), ticker.WithSpeed(speed))
	ticker.Run(ctx)
}
