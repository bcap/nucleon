import { Reactor } from './reactor.js'

export class Simulation {
    constructor() {
        this.reactor = new Reactor()
        this.timePassed = 0
        this.ticks = 0
    }

    tick(tickNum, timePassed) {
        this.reactor.tick(tickNum, timePassed)
        this.timePassed += timePassed
        this.ticks = tickNum
    }
}
