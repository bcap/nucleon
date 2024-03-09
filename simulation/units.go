package simulation

import "time"

type watts = float64

type joules = float64

type amps = float64

type ampHours = float64

type volts = float64

type kEff = float64

type reactivity = float64

func WattsToJoules(w watts, t time.Duration) joules {
	return w * t.Seconds()
}

func JoulesToWatts(j joules, t time.Duration) watts {
	return j / t.Seconds()
}

func AmpsToWatts(a amps, v volts) watts {
	return a * v
}

func WattsToAmps(w watts, v volts) amps {
	return w / v
}

func AmpHourToJoules(ah ampHours, v volts) joules {
	return ah * v * 3600
}

func JoulesToAmpHours(j joules, v volts) ampHours {
	return j / (v * 3600)
}
