
export class Action {
    constructor(app) {
        this.app = app
        this.simulation = app.simulation
        this.reactor = this.simulation.reactor
        this.pressurizer = this.simulation.pressurizer
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
        this.app.simulationTicker.setRate(Number(value), this.app.simulationTicker.timeFactor)
    }

    renderRate(value) {
        this.app.renderTicker.setRate(Number(value), this.app.renderTicker.timeFactor)
    }

    chartRenderRate(value) {
        this.app.chartRenderTicker.setRate(Number(value), this.app.chartRenderTicker.timeFactor)
    }

    timeFactor(value) {
        this.app.simulationTicker.setRate(this.app.simulationTicker.tickRate, Number(value))
        this.app.renderTicker.setRate(this.app.renderTicker.tickRate, Number(value))
        this.app.chartRenderTicker.setRate(this.app.chartRenderTicker.tickRate, Number(value))
    }
}
