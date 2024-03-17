
export class Ticker {
    constructor(name, tickFn, tickRate = 30.0, timeFactor = 1.0) {
        this.name = name
        this.tickFn = tickFn
        this.ticks = 0
        this.paused = false
        this.clockMs = 0
        this.setRate(tickRate)
        this.setFactor(timeFactor)

        // load monitoring
        this.loadPct = 0                // how busy the ticker is
        this.warningThresholdPct = 80   // warn when ticks use 80% or more of the cpu time
        this.loadCheckMs = 1000         // check every second
        this.loadCheckAtTime = 0        // supporting date var
        this.loadCheckAtTick = 0        // supporting tick var
        this.loadCheckTimeTakenMs = 0   // supporting accumulator var
    }

    setRate(tickRate) {
        this.tickRate = tickRate
        this.baseSleepTimeMs = 1 / this.tickRate * 1000
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

    async sleep(durationMs) {
        if (durationMs < 0) {
            return
        }
        await new Promise(r => setTimeout(r, durationMs));
    }

    async run() {
        let sleepTime = this.baseSleepTimeMs
        let lastTickAt = Date.now()
        this.loadCheckAtTime = lastTickAt
        while (true) {
            await this.sleep(sleepTime)
            let now = Date.now()
            let timePassedMs = (now - lastTickAt) * this.timeFactor
            if (this.paused) {
                lastTickAt = now
                continue
            }
            this.clockMs += timePassedMs
            this.ticks += 1
            this.tickFn(this.ticks, timePassedMs)
            const tickTimeTakenMs = Date.now() - now
            sleepTime = this.baseSleepTimeMs - tickTimeTakenMs
            this.loadCheck(tickTimeTakenMs)
            lastTickAt = now
        }
    }

    loadCheck(tickTimeTakenMs) {
        this.loadCheckTimeTakenMs += tickTimeTakenMs
        const now = Date.now()
        if (now - this.loadCheckAtTime < this.loadCheckMs) {
            return
        }
        const ticks = this.ticks - this.loadCheckAtTick
        this.loadPct = this.loadCheckTimeTakenMs / (ticks * this.baseSleepTimeMs) * 100
        if (this.loadPct >= this.warningThresholdPct) {
            console.log(`WARN | ${this.name} ticker used ${this.loadPct}%`)
        }
        this.loadCheckAtTime = now
        this.loadCheckTimeTakenMs = 0
        this.loadCheckAtTick = this.ticks
    }
}