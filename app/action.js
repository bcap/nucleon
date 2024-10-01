
export class Action {
    constructor(app) {
        this.app = app
        this.simulation = app.simulation
        this.reactor = this.simulation.reactor
        this.pressurizer = this.simulation.pressurizer
        this.tickers = () => [
            this.app.simulationTicker, 
            this.app.renderTicker, 
            this.app.chartRenderTicker,
        ]
    }

    heaterState(on) {
        this.pressurizer.heaterOn = on
    }
    
    heaterAdjustPower(delta) {
        this.pressurizer.adjustPower(delta)
    }

    rodUp() {
        this.reactor.moveControlRod(1)
    }

    rodUpAll() {
        this.reactor.moveControlRod(+Infinity)
    }

    rodDown() {
        this.reactor.moveControlRod(-1)
    }

    rodDownAll() {
        this.reactor.moveControlRod(-Infinity)
    }

    simulationRate(value) {
        ifGreaterThanZero(value, (value) => this.app.simulationTicker.setRate(value))
    }

    renderRate(value) {
        ifGreaterThanZero(value, (value) => this.app.renderTicker.setRate(value))
    }

    chartRenderRate(value) {
        ifGreaterThanZero(value, (value) => this.app.chartRenderTicker.setRate(value))
    }

    timeFactor(value) {
        this.tickers().forEach(ticker => ifGreaterThanZero(value, (value) => ticker.setFactor(value)))
    }

    pause() {
        this.tickers().forEach(ticker => ticker.pause())
    }

    play() {
        this.tickers().forEach(ticker => ticker.play())
    }
}

function ifGreaterThanZero(value, fn) {
    const n = Number(value)
    if (n > 0) {
        fn(n)
    }
}