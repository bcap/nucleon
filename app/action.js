
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

    tickRate(value) {
        this.app.simulationTicker.setRate(Number(value))
    }

    renderRate(value) {
        this.app.renderTicker.setRate(Number(value))
    }

    chartRenderRate(value) {
        this.app.chartRenderTicker.setRate(Number(value))
    }

    timeFactor(value) {
        this.tickers().forEach(ticker => ticker.setFactor(Number(value)))
    }

    pause() {
        this.tickers().forEach(ticker => ticker.pause())
    }

    play() {
        this.tickers().forEach(ticker => ticker.play())
    }
}
