#!/usr/bin/env python3

maxT=360
step=10

pressures = 'pressures = Quantity[Table[p, {p, 1, 160}], "Bars"]'

temps = "\n".join(
    f'temps{x+1} = Quantity[Table[t, {{t, {x*step+1}, {(x+1)*step}}}], "DegreesCelsius"]' 
    for x in range(0,int(maxT/step))
)

densities = "\n".join(
    f'densities{x+1} = ThermodynamicData["Water", "Density", {{"Temperature" -> temps{x+1}, "Pressure" -> pressures }}]' 
    for x in range(0,int(maxT/step))
)

exports = (
    'Export["densities.txt", {' + 
    ", ".join(f'densities{x+1}' for x in range(0,int(maxT/step))) + 
    '}]' 
)

print(pressures)
print(temps)
print(densities)
print(exports)