import { density as waterDensityTable } from "./tables/waterdensity.js"
import { byPressure as waterBoilingTemperatureByPressureTable, byTemperature as waterBoilingPressureByTemperatureTable } from "./tables/waterboilingpoint.js"

export { waterDensityTable, waterBoilingTemperatureByPressureTable, waterBoilingPressureByTemperatureTable }

export function heatTransfer(temperature1, temperature2, ratio, seconds) {
    const timeAdjustedRatio = 1 - Math.pow(1 - ratio, seconds)
    const deltaMidpoint = (temperature1 - temperature2) / 2
    const transfer = deltaMidpoint * timeAdjustedRatio
    return [temperature1 - transfer, temperature2 + transfer, transfer]
}


const antoineCoefficients = {
    t0to100: {
        A: 8.07131,
        B: 1730.63,
        C: 233.426
    },
    t100to374: {
        A: 8.14019,
        B: 1810.94,
        C: 244.485
    }
}

export const mmHgToBar = 0.00133322
export const barToMmHG = 1 / mmHgToBar

export function waterBoilingPressureByTemperature(temperature) {
    if (temperature < 0 || temperature > 374) {
        return NaN
    }
    let a = antoineCoefficients.t0to100.A
    let b = antoineCoefficients.t0to100.B
    let c = antoineCoefficients.t0to100.C
    if (temperature >= 100) {
        a = antoineCoefficients.t100to374.A
        b = antoineCoefficients.t100to374.B
        c = antoineCoefficients.t100to374.C
    }
    const exponent = a - b / (c + temperature)
    const pressure = Math.pow(10, exponent)
    return pressure * mmHgToBar
}

export function waterBoilingTemperatureByPressure(pressure) {
    pressure = pressure / mmHgToBar
    let a = antoineCoefficients.t0to100.A
    let b = antoineCoefficients.t0to100.B
    let c = antoineCoefficients.t0to100.C
    let temperature = b / (a - Math.log10(pressure)) - c
    if (temperature > 100) {
        a = antoineCoefficients.t100to374.A
        b = antoineCoefficients.t100to374.B
        c = antoineCoefficients.t100to374.C
        temperature = b / (a - Math.log10(pressure)) - c
    }
    return temperature
}

export function waterDensity(pressure, temperature) {
    const pLowTLow = waterDensityStep(pressure, temperature)
    const pHighTLow = waterDensityStep(pressure + 1, temperature)
    const pLowTHigh = waterDensityStep(pressure, temperature + 1)
    if (pLowTLow === undefined || pHighTLow === undefined || pLowTHigh === undefined) {
        return undefined
    }
    const pressureFraction = pressure - Math.floor(pressure)
    const pressureDelta = (pHighTLow - pLowTLow) * pressureFraction
    const temperatureFraction = temperature - Math.floor(temperature)
    const temperatureDelta = (pLowTHigh - pLowTLow) * temperatureFraction
    return pLowTLow + pressureDelta + temperatureDelta
}

function waterDensityStep(pressure, temperature) {
    const temperatureTable = waterDensityTable[Math.trunc(pressure) - 1]
    if (!temperatureTable) {
        return undefined
    }
    const density = temperatureTable[Math.trunc(temperature) - 1]
    if (!density) {
        return undefined
    }
    return density
}