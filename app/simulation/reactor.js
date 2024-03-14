
import { heatTransfer } from "./physics.js"

export class Reactor {
    constructor() {
        this.controlRodPosition = 0
        this.desiredControlRodPosition = 0
        this.minRodPosition = 0
        this.maxRodPosition = 250
        this.rodSpeed = 3 // steps per second

        this.reactivity = 0
        this.kEff = 0
        this.medianNeutronLifetimeMs = 100  // 100ms
        this.period = Infinity
        this.startupRate = Infinity

        this.minNeutronFlux = 1000
        this.neutronFlux = this.minNeutronFlux
        this.neutronFluxDelta = 0

        this.fastFissionP = 1.03
        this.fastNonLeakageP = 0.95
        this.resonanceEscapeP = 0.75
        this.thermalNonLeakageP = 0.96
        this.thermalUtilizationP = 0.70
        this.reproductionFactor = 2.03

        this.fuelTemperature = 25
        this.waterTemperature = 25
        this.fuelTemperatureDelta = 0
        this.waterTemperatureDelta = 0

        this.neutronsPerDegree = 10_000_000_000  // 10 billion neutrons to raise fuel temperature by 1 degree
        this.resonanceEscapeDropPerDegree = 1 / 20000  // emulates Fuel Temperature Coefficient (FTC)

        this.fuelToWaterHeatTransferRatio = 0.08 // 8% per second
        this.waterToEnvironmentHeatTransferRatio = 0.22 // 22% per second
    }

    tick(tickNum, timePassedMs) {
        const secs = timePassedMs / 1000;

        // move rods if needed
        if (this.desiredControlRodPosition > this.controlRodPosition) {
            this.controlRodPosition += this.rodSpeed * secs
            if (this.controlRodPosition > this.desiredControlRodPosition) {
                this.controlRodPosition = this.desiredControlRodPosition
            }
        } else if (this.desiredControlRodPosition < this.controlRodPosition) {
            this.controlRodPosition -= this.rodSpeed * secs
            if (this.controlRodPosition < this.desiredControlRodPosition) {
                this.controlRodPosition = this.desiredControlRodPosition
            }
        }

        // https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/six-factor-formula-effective-multiplication-factor/
        this.thermalUtilizationP = 0.688 + (0.0006 * this.controlRodPosition)
        this.resonanceEscapeP = 0.75 - ((this.fuelTemperature - 25) * this.resonanceEscapeDropPerDegree)
        this.kEff =
            this.fastFissionP *
            this.fastNonLeakageP *
            this.resonanceEscapeP *
            this.thermalNonLeakageP *
            this.thermalUtilizationP *
            this.reproductionFactor

        // https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/reactivity/
        this.reactivity = (this.kEff - 1) / this.kEff
        // https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/reactivity/reactor-period-2/
        this.period = this.medianNeutronLifetimeMs / 1000 / (this.kEff - 1)
        // https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/reactivity/doubling-time/
        this.doublingTime = this.period * 0.6932
        // https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/reactivity/startup-rate-sur/
        this.startupRate = 26.06 / this.period

        const generations = timePassedMs / this.medianNeutronLifetimeMs;
        const timedKEff = Math.pow(this.kEff, generations)
        let neutronFlux = this.neutronFlux * timedKEff;
        if (neutronFlux < this.minNeutronFlux) {
            neutronFlux = this.minNeutronFlux;
        }
        this.neutronFluxDelta = (neutronFlux - this.neutronFlux) / secs
        this.neutronFlux = neutronFlux

        // fuel and water thermal dynamics
        let fuelTemperature = this.fuelTemperature;
        let waterTemperature = this.waterTemperature;

        //
        // Option 1:
        // Slow feedback loop from FTC: Bouncy Reactor, snakes around 0 reactivity, eventually converges
        //
        // increase 1 degree of fuel temperature by every neutronsPerDegree neutrons
        const fuelTempIncrease = this.neutronFlux / this.neutronsPerDegree * secs
        if (fuelTempIncrease > 0) {
            fuelTemperature += fuelTempIncrease
        }

        //
        // Option 2:
        // Fast feedback loop from FTC: Reactor quickly converges on zero reactivity
        //
        // const targetFuelTemperature = 25 + this.neutronFlux / this.neutronsPerDegree;
        // const [, , transfer] = heatTransfer(targetFuelTemperature, fuelTemperature, 0.1, secs);
        // if (transfer > 0) {
        //     fuelTemperature = targetFuelTemperature;
        // }

        // transfer of heat from fuel to water
        [fuelTemperature, waterTemperature,] = heatTransfer(fuelTemperature, waterTemperature, this.fuelToWaterHeatTransferRatio, secs);

        // water heat loss to environment
        [waterTemperature, ,] = heatTransfer(waterTemperature, 25, this.waterToEnvironmentHeatTransferRatio, secs);

        // update temperatures
        this.fuelTemperatureDelta = (fuelTemperature - this.fuelTemperature) / secs;
        this.waterTemperatureDelta = (waterTemperature - this.waterTemperature) / secs;
        this.fuelTemperature = fuelTemperature;
        this.waterTemperature = waterTemperature;
    }

    moveControlRod(stepsDelta) {
        let desiredPosition = this.desiredControlRodPosition + stepsDelta

        if (
            stepsDelta === 0 ||
            (this.desiredControlRodPosition > this.controlRodPosition && stepsDelta < 0) ||
            (this.desiredControlRodPosition < this.controlRodPosition && stepsDelta > 0)
        ) {
            desiredPosition = this.controlRodPosition + stepsDelta
        }

        if (desiredPosition < this.minRodPosition) {
            desiredPosition = this.minRodPosition
        } else if (desiredPosition > this.maxRodPosition) {
            desiredPosition = this.maxRodPosition
        }
        this.desiredControlRodPosition = Math.round(desiredPosition)
    }
}
