
export class Ticker {
    constructor(tickFn, tickRate = 30.0, timeFactor = 1.0) {
        this.tickFn = tickFn
        this.setRate(tickRate, timeFactor)
    }

    setRate(tickRate, timeFactor) {
        this.tickRate = tickRate
        this.timeFactor = timeFactor
        this.sleepTimeMs = 1 / this.tickRate * 1000
    }

    async run() {
        let tickNum = 0 
        let lastTickAt = Date.now()
        while (true) {
            await new Promise(r => setTimeout(r, this.sleepTimeMs));
            let now = Date.now()
            let timePassed = (now - lastTickAt) * this.timeFactor
            tickNum += 1
            this.tickFn(tickNum, timePassed)
            lastTickAt = now
        }
    }
}