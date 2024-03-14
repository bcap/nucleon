
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


export function formatBigNumber(value, round = 2, plus = false) {
    const abs = Math.abs(value)
    let valueStr;
    if (abs >= 1_000_000_000_000) {
        valueStr = String((value / 1_000_000_000_000).toFixed(round)) + "T"
    } else if (abs >= 1_000_000_000) {
        valueStr = String((value / 1_000_000_000).toFixed(round)) + "B"
    } else if (abs >= 1_000_000) {
        valueStr = String((value / 1_000_000).toFixed(round)) + "M"
    } else if (abs >= 1_000) {
        valueStr = String((value / 1_000).toFixed(round)) + "K"
    } else {
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