package main

import (
	"context"

	"github.com/bcap/nucleon/simulation"
	"github.com/bcap/nucleon/ticker"
)

func main() {
	ticksPerS := 60.0
	ctx := context.Background()
	sim := simulation.New()
	ticker.Run(ctx, ticksPerS, sim)
}
