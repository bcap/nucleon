import { ReactorChart } from './chart/chart.js'
import { formatBigNumber, formatDuration, formatNumber } from './format/format.js'

export class Render {
    constructor(app) {
        this.app = app
        this.simulation = app.simulation
        this.reactor = this.simulation.reactor
        this.reactorDelta = this.simulation.reactorDelta
        this.pressurizer = this.simulation.pressurizer
    }

    render(tickNum, timePassed) {
        this.totalTimePassed += timePassed

        // pressurizer
        setOnOff("heaterState", this.pressurizer.heaterOn)
        setNumber("heaterTemperature", this.pressurizer.heaterTemperature, 2)
        setNumber("heaterWaterTemperature", this.pressurizer.waterTemperature, 2)
        setNumber("heaterPower", this.pressurizer.heaterPower, 0)
        setNumber("pressure", this.pressurizer.pressure, 2)

        // reactor
        setNumber("fastFissionP", this.reactor.fastFissionP, 4)
        setNumber("fastNonLeakageP", this.reactor.fastNonLeakageP, 4)
        setNumber("resonanceEscapeP", this.reactor.resonanceEscapeP, 4)
        setNumber("thermalNonLeakageP", this.reactor.thermalNonLeakageP, 4)
        setNumber("thermalUtilizationP", this.reactor.thermalUtilizationP, 4)
        setNumber("reproductionFactor", this.reactor.reproductionFactor, 4)
        setNumber("kEff", this.reactor.kEff, 6)
        setNumber("reactivity", this.reactor.reactivity, 6, true)
        setNumber("milliNiles", this.reactor.reactivity * 100 * 1000, 0)
        if (Math.abs(this.reactor.reactivity) > 0.0000009) {
            setDuration("period", this.reactor.period * 1000)
            setDuration("doublingTime", this.reactor.doublingTime * 1000)
        } else {
            setText("period", "N/A")
            setText("doublingTime", "N/A")
        }
        setNumber("startupRate", this.reactor.startupRate)
        setBigNumber("neutronFlux", this.reactor.neutronFlux, 2)
        setBigNumber("neutronFluxDelta", this.reactorDelta.neutronFluxDelta, 1, true)
        setNumber("fuelTemperature", this.reactor.fuelTemperature, 2)
        setNumber("fuelTemperatureDelta", this.reactorDelta.fuelTemperatureDelta * 1000, 0, true)
        setNumber("waterTemperature", this.reactor.waterTemperature, 2)
        setNumber("waterTemperatureDelta", this.reactorDelta.waterTemperatureDelta * 1000, 0, true)
        setNumber("rodSteps", this.reactor.controlRodPosition, 0)
        setNumber("reactorPressure", this.reactor.pressure, 2)
        const density = 1 / (this.reactor.waterDensity * 1000 / (100 * 100 * 100))  // converts kg/m^3 to cm^3/g
        setNumber("reactorWaterDensity", density, 4) 
        setNumber("reactorBoilingPoint", this.reactor.boilingPoint, 2)
        // setNumber("reactorBoilingPointDelta", this.reactor.boilingPoint - this.reactor.waterTemperature, 2)
        setText("reactorWaterState", this.reactor.waterState)

        // simulation/render ticks
        setDuration("simulationTime", this.simulation.timePassedMs)
        setNumber("simulationTicks", this.app.simulationTicker.ticks, 0)
        setNumber("renderTicks", this.app.renderTicker.ticks, 0)
        setNumber("chartRenderTicks", this.app.chartRenderTicker.ticks, 0)
        setNumber("currentTimeFactor", this.app.simulationTicker.timeFactor, 0)
        setNumber("currentTickRate", this.app.simulationTicker.tickRate, 0)
        setNumber("currentRenderRate", this.app.renderTicker.tickRate, 0)
        setNumber("currentChartRenderRate", this.app.chartRenderTicker.tickRate, 0)
    }
}

export class ChartRender {
    constructor(app) {
        this.app = app
        this.simulation = app.simulation
        this.reactor = this.simulation.reactor
        this.chart = new ReactorChart("chart", 60_000)
    }

    render(tickNum, timePassed) {
        this.chart.add(
            this.simulation.timePassedMs,
            this.reactor.neutronFlux,
            this.reactor.fuelTemperature,
            this.reactor.waterTemperature,
            this.reactor.controlRodPosition,
        )
    }
}

function setOnOff(id, on) {
    setText(id, on ? "ON" : "OFF")
}

function setText(id, text) {
    document.getElementById(id).textContent = text
}

function setNumber(id, value, round = 2, plus = false) {
    setText(id, formatNumber(value, round, plus))
}

function setBigNumber(id, value, round = 2, plus = false) {
    setText(id, formatBigNumber(value, round, plus))
}

function setDuration(id, durationMillis) {
    setText(id, formatDuration(durationMillis))
}