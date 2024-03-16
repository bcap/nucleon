
export function formatNumber(value, round, plus = false) {
    value = value.toFixed(round)
    if (value == 0) {
        value = 0
        value = value.toFixed(round)
    }
    if (plus && value >= 0) {
        return "+" + String(value)
    }
    return String(value)
}

const units  = [
    { symbol: "K", value: 1_000 },
    { symbol: "M", value: 1_000_000 },
    { symbol: "B", value: 1_000_000_000 },
    { symbol: "T", value: 1_000_000_000_000 },
    { symbol: "P", value: 1_000_000_000_000_000 },
].sort((a, b) => a.value - b.value)

export function formatBigNumber(value, round = 2, plus = false) {
    const abs = Math.abs(value)
    let valueStr;
    for (let i = units.length - 1; i >= 0; i--) {
        const item = units[i]
        if (abs >= item.value) {
            valueStr = String((value / item.value).toFixed(round)) + item.symbol
            break
        }
    }
    if (!valueStr) {
        valueStr = String(value.toFixed(0))
    }
    if (plus && value >= 0) {
        valueStr = "+" + valueStr
    }
    return valueStr
}

export function formatDuration(durationMillis) {
    let sign = ""
    if (durationMillis < 0) {
        sign = "-"
        durationMillis = -durationMillis
    }
    const totalSeconds = durationMillis / 1000
    const totalMinutes = totalSeconds / 60
    const totalHours = totalMinutes / 60

    const millis = String(Math.floor(durationMillis % 1000)).padStart(3, '0')
    const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, '0')
    const minutes = String((Math.floor(totalMinutes % 60))).padStart(2, '0')
    const hours = String(Math.floor(totalHours)).padStart(2, '0')

    const time = `${sign}${hours}:${minutes}:${seconds}.${millis}`
    return time
}