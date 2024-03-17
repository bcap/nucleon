import { heatTransfer, waterBoilingPressureByTemperature } from "../physics/physics.js"

export class Pressurizer {
    constructor() {
        this.heaterOn = false
        this.heaterPower = 10000
        this.maxHeaterPower = 25000
        this.powerPerDegree = 50
        this.heaterHeatEfficiency = 0.5
        this.heaterTransferEfficiency = 0.1
        this.waterHeatLoss = 0.002

        this.pressure = 1
        this.waterTemperature = 25
        this.heaterTemperature = this.waterTemperature
    }

    tick(tickNum, timePassedMs) {
        const secs = timePassedMs / 1000;

        // heater turned on, heater pads heat up
        if (this.heaterOn) {
            const targetHeaterTemperature = 25 + this.heaterPower / this.powerPerDegree;
            if (this.heaterTemperature < targetHeaterTemperature) {
                [this.heaterTemperature, ,] = heatTransfer(this.heaterTemperature, targetHeaterTemperature, this.heaterHeatEfficiency, secs)
            }
        }
        // heat transfer between heater and water
        [this.heaterTemperature, this.waterTemperature, ] = heatTransfer(this.heaterTemperature, this.waterTemperature, this.heaterTransferEfficiency, secs);
        
        // water heat loss to the environment
        [this.waterTemperature, , ] = heatTransfer(this.waterTemperature, 25, this.waterHeatLoss, secs)

        // set pressure
        const boilingPressure = waterBoilingPressureByTemperature(this.waterTemperature)
        if (boilingPressure && boilingPressure > 1) {
            this.pressure = boilingPressure
        }
    }

    adjustPower(delta) {
        this.heaterPower = Math.max(0, Math.min(this.heaterPower + delta, this.maxHeaterPower))
    }
}
