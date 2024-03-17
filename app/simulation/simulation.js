import { Reactor, ReactorDelta } from './reactor.js'
import { Pressurizer } from './pressurizer.js'
import { heatTransfer } from '../physics/physics.js'

export class Simulation {
    constructor() {
        this.pressurizer = new Pressurizer()
        this.reactor = new Reactor()
        this.reactorDelta = new ReactorDelta(this.reactor)
        this.reactorPressurizerTransfer = new ReactorPressurizerTransfer(this.reactor, this.pressurizer)
        this.timePassedMs = 0
        this.ticks = 0
    }

    tick(tickNum, timePassedMs) {
        this.timePassedMs += timePassedMs
        this.ticks = tickNum

        // module ticks
        this.pressurizer.tick(tickNum, timePassedMs)
        this.reactor.tick(tickNum, timePassedMs)
        
        // transfers
        this.reactorPressurizerTransfer.tick(tickNum, timePassedMs)

        // deltas
        this.reactorDelta.tick(tickNum, timePassedMs)
    }
}

class ReactorPressurizerTransfer {
    constructor(reactor, pressurizer) {
        this.reactor = reactor
        this.pressurizer = pressurizer
        this.temperatureTransferRatio = 0.0002
    }

    tick(tickNum, timePassedMs) {
        const secs = timePassedMs / 1000
        this.reactor.pressure = this.pressurizer.pressure;
        [this.reactor.waterTemperature, this.pressurizer.waterTemperature, ] = heatTransfer(this.reactor.waterTemperature, this.pressurizer.waterTemperature, this.temperatureTransferRatio, secs)
    }
}
