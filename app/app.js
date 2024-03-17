
import { Action } from './action.js'
import { ChartRender, Render } from './render.js'
import { Simulation } from './simulation/simulation.js'
import { Ticker } from './ticker/ticker.js'
import * as physics from './physics/physics.js'

class App {
    constructor() {
        this.simulation = new Simulation()
        this.render = new Render(this)
        this.chartRender = new ChartRender(this)
        this.action = new Action(this)
        
        let tickRate = 60.0
        let renderRate = 30.0
        let chartRenderRate = 30.0
        let timeFactor = 1.0

        this.simulationTicker = new Ticker("simulation", this.simulation.tick.bind(this.simulation), tickRate, timeFactor)
        this.renderTicker = new Ticker("info", this.render.render.bind(this.render), renderRate, timeFactor)
        this.chartRenderTicker = new Ticker("chart", this.chartRender.render.bind(this.chartRender), chartRenderRate, timeFactor)
    }

    async run() {
        await Promise.all([
            this.simulationTicker.run(), 
            this.renderTicker.run(),
            this.chartRenderTicker.run(),
        ])
    }
}

let app = new App()

// register objects to the window for both functionality and debugging
window.app = app
window.action = app.action
window.physics = physics

app.run()
