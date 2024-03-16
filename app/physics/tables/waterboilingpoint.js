import { density as waterDensity } from "./waterdensity.js"

const tables = genTables()
export const byPressure = tables[0]
export const byTemperature = tables[1]

function genTables() {
    const byPressure = {}
    const byTemperature = {}

    for (let i = 0; i < waterDensity.length; i++) {
        const pressure = i+1
        const pressureTable = waterDensity[i]
        let found = false
        for (let j = 1; j < pressureTable.length; j++) {
            const temperature = j+1
            const density = pressureTable[j]
            const prevDensity = pressureTable[j-1]
            const factor = prevDensity / density
            if (factor > 2) {
                byPressure[pressure] = temperature
                byTemperature[temperature] = pressure
                found = true
                break
            }
        }
        if (!found) {
            throw new Error("No boiling point found for pressure: " + pressure)
        }
    }
    return [byPressure, byTemperature]
}
