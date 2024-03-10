
import { Chart as chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js/+esm'
chart.register(...registerables)

export class ReactorChart {
    constructor(canvasId, maxTimeWindowMs) {
        this.maxTimeWindowMs = maxTimeWindowMs
        this.times = []
        this.datasets = [
            {
                label: "neutron flux",
                yAxisID: "neutrons",
                borderColor: 'rgb(198, 3, 252)',
                backgroundColor: 'rgb(198, 3, 252)',
                data: [],
            },
            { 
                label: "fuel temperature",
                yAxisID: "temperature",
                borderColor: 'rgb(252, 3, 57)',
                backgroundColor: 'rgb(252, 3, 57)',
                data: [],
            },
            {
                label: "water temperature",
                yAxisID: "temperature",
                borderColor: 'rgb(3, 173, 252)',
                backgroundColor: 'rgb(3, 173, 252)',
                data: [],
            },
            {
                label: "control rod position",
                yAxisID: "controlRod",
                borderColor: 'rgb(87, 255, 157)',
                backgroundColor: 'rgb(87, 255, 157)',
                data: [],
            }
        ]

        const canvas = document.getElementById(canvasId)
        this.chart = new chart(canvas, {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: this.datasets
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        beginAtZero: false,
                        suggestedMin: 0,
                        suggestedMax: this.maxTimeWindowMs / 1000,
                        bounds: 'data',
                        ticks: {
                            display: true,
                            precision: 0,
                            stepSize: 1,
                            autoSkip: false,
                            includeBounds: false,
                        }
                    },
                    temperature: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'temp °C',
                        },
                        position: 'right',
                        suggestedMin: 0,
                        suggestedMax: 1000,
                    },
                    neutrons: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'neutron flux',
                        },
                        position: 'right',
                        suggestedMin: 0,
                        suggestedMax: 1_000_000_000,
                    },
                    controlRod: {
                        display: false,
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'control rod position',
                        },
                        position: 'right',
                        suggestedMin: 0,
                        suggestedMax: 250,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                        hitRadius: 3,
                    },
                    line: {
                        borderWidth: 3
                    }
                }
            }
        })

        // disable animations
        this.chart.options.animation = false
        this.chart.options.transitions.active.animation.duration = 0
    }

    add(timeMs, neutronFlux, fuelTemperature, waterTemperature, controlRodPosition) {
        this.times.push(timeMs)
        const timeSecs = timeMs / 1000
        this.datasets[0].data.push({ x: timeSecs, y: neutronFlux })
        this.datasets[1].data.push({ x: timeSecs, y: fuelTemperature })
        this.datasets[2].data.push({ x: timeSecs, y: waterTemperature })
        this.datasets[3].data.push({ x: timeSecs, y: controlRodPosition })

        let datasetFull = false
        while (this.times.length > 0) {
            const oldest = this.times[0]
            const delta = timeMs - oldest
            if (delta < this.maxTimeWindowMs) {
                break
            }
            datasetFull = true
            this.times.shift()
            for (let dataset of this.datasets) {
                dataset.data.shift()
            }
        }
        if (datasetFull) {
            this.chart.options.scales.x.min = this.times[0] / 1000
            this.chart.options.scales.x.max = this.times[this.times.length - 1] / 1000
        }
        this.update()
    }

    update() {
        this.chart.update()
    }
}