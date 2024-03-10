
export function heatTransfer(temperature1, temperature2, ratio, seconds) {
    const timeAdjustedRatio = 1 - Math.pow(1 - ratio, seconds)
    const delta = temperature1 - temperature2
    const transfer = delta * timeAdjustedRatio
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

// 1 mmHg in bars
const mmHGToBar = 0.00133322

export function waterBoilingPointP(temperature) {
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
    return pressure * mmHGToBar
}

export function waterBoilingPointT(pressure) {
    pressure = pressure / mmHGToBar
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