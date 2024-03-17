
export class Ticker {
    constructor(tickFn, tickRate = 30.0, timeFactor = 1.0) {
        this.tickFn = tickFn
        this.ticks = 0
        this.paused = false
        this.setRate(tickRate)
        this.setFactor(timeFactor)
    }

    setRate(tickRate) {
        this.tickRate = tickRate
        this.sleepTimeMs = 1 / this.tickRate * 1000
    }

    setFactor(timeFactor) {
        this.timeFactor = timeFactor
    }

    pause() {
        this.paused = true
    }

    play() {
        this.paused = false
    }

    async run() {
        let lastTickAt = Date.now()
        while (true) {
            await new Promise(r => setTimeout(r, this.sleepTimeMs));
            let now = Date.now()
            let timePassed = (now - lastTickAt) * this.timeFactor
            if (this.paused) {
                lastTickAt = now
                continue
            }
            this.ticks += 1
            this.tickFn(this.ticks, timePassed)
            lastTickAt = now
        }
    }
}