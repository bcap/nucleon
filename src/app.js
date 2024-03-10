
import { Action } from './action.js'
import { Render } from './render.js'
import { Simulation } from './simulation/simulation.js'
import { Ticker } from './ticker/ticker.js'
import * as physics from './simulation/physics.js'

class App {
    constructor() {
        this.simulation = new Simulation()
        this.render = new Render(this)
        this.action = new Action(this)
        
        let tickRate = 60.0
        let renderRate = 30.0
        let timeFactor = 1.0
        this.simulationTicker = new Ticker(this.simulation.tick.bind(this.simulation), tickRate, timeFactor)
        this.renderTicker = new Ticker(this.render.render.bind(this.render), renderRate, timeFactor)
    }

    async run() {
        await Promise.all([
            this.simulationTicker.run(), 
            this.renderTicker.run(),
        ])
    }
}

let app = new App()

// register objects to the window for both functionality and debugging
window.app = app
window.action = app.action
window.physics = physics

app.run()
