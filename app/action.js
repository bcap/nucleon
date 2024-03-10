
export class Action {
    constructor(app) {
        this.app = app
        this.simulation = app.simulation
        this.reactor = this.simulation.reactor
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

    renderRate(value) {
        this.app.renderTicker.setRate(Number(value), this.app.renderTicker.timeFactor)
    }

    tickRate(value) {
        this.app.simulationTicker.setRate(Number(value), this.app.simulationTicker.timeFactor)
    }

    timeFactor(value) {
        this.app.simulationTicker.setRate(this.app.simulationTicker.tickRate, Number(value))
        this.app.renderTicker.setRate(this.app.renderTicker.tickRate, Number(value))
    }
}
