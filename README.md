# Nucleon

Playing around with simulating a Pressurized Water Reactor (PWR)

Try it out at [bcap.github.io/nucleon/app/](https://bcap.github.io/nucleon/app/)

Source: [github.com/bcap/nucleon](https://github.com/bcap/nucleon)

Roadmap/Progress: [trello.com/b/sKz4CiAl/nucleon](https://trello.com/b/sKz4CiAl/nucleon)

## Notes / Formulas / Coefficients

- Fuel
    - Enriched up to 4%-5% U-235. The rest is U-238
    - U-235 fission averages to 2.4 neutrons per atom fissioned
    - Canada's CANDU reactors do not use enriched uranium
    - A reactor contains ~200 fuel assemblies, each assembly is a 17x17 grid (289 positions) with 264 fuel pins, 25 rods and 1 spare guide tube. Each fuel pin contains ~400 fuel pellets. Each pellet weights 20 grams
        - Total of 21,120,000 pellets (422,400 kg) in the reactor, with 105,600 pellets (2,112 kg) per assembly
- Reaction
    - A reactor generating 3500MW has 100 quintillion (10^20) fissions per second 
    - 1 Nile := 1% or 0.01 (10^-2) change in reactivity
    - 1 MilliNile := 0.001% or 0.00001 (10^-5) change in reactivity
    - Fuel control rod insertion decreases reactivity by 8 Niles
    - Control rods in real world reactors seems to have a small number of possible steps. Using 250 for the simulation though
    - Control rods are made of Ag-In-Cd: 80% Silver, 15% Indium and 5% Cadmium

- Pressure
    - Primary loop runs at 155 bars of pressure, where the water boiling point is 345C

- Plant
    - 34% efficiency: To generate 1200MW of electricity, the reactor heat output is around 3500MW. 
        - Extra heat goes to the environment as heated water



## Resources:

- Books
    - How to Drive a Nuclear Reactor by Colin Tucker - 2019
        - https://link.springer.com/book/10.1007/978-3-030-33876-3
    - Department of Energy (USA) Fundamentals Handbook, Nuclear Physics and Reactor Theory - 1996
        - https://www.standards.doe.gov/standards-documents/1000/1019-bhdbk-1993-v1
        - https://www.standards.doe.gov/standards-documents/1000/1019-bhdbk-1993-v2
    - Nuclear Reactor Analysis by James J. Duderstadt and Louis J. Hamilton - 1976
        - https://deepblue.lib.umich.edu/bitstream/handle/2027.42/89079/1976_Nuclear_Reactor_Analysis.pdf
    - "Introduction to Nuclear Reactor Theory" by John R. Lamarsh
        - http://www.gammaexplorer.com/wp-content/uploads/2014/03/Introduction-to-Nuclear-Engineering-Lamarsh-3rd-Edition.pdf

- Nuclear Physics
    - https://en.wikipedia.org/wiki/Nuclear_reactor_physics
    - Wikipedia on Six Factor Formula: https://en.wikipedia.org/wiki/Six_factor_formula
    - Unknown Course Module on the subject: https://canteach.candu.org/Content%20Library/20041105.pdf
    - Better explanation of Six Factor Formula: https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/six-factor-formula-effective-multiplication-factor/
    - How operational components influence the Six Factor Formula (FTC / MTC / etc): https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/operational-factors/
    - Reactivity: https://www.nuclear-power.com/nuclear-power/reactor-physics/nuclear-fission-chain-reaction/reactivity/
    - Lecture on Six Factor Formula: https://www.youtube.com/watch?v=4gmQXZMzwgs
    - Youtube Series: MIT 22.01 Introduction to Nuclear Engineering and Ionizing Radiation: https://www.youtube.com/playlist?list=PLUl4u3cNGP61FVzAxBP09w2FMQgknTOqu
    - Point Kinetics Equations: https://www.nuclear-power.com/nuclear-power/reactor-physics/reactor-dynamics/point-kinetics-equations/

- Thermodynamics
    - Heat Transfer (convection) https://en.wikipedia.org/wiki/Convection_(heat_transfer)
    - List of thermal conductivities https://en.wikipedia.org/wiki/List_of_thermal_conductivities
    - Boiling Point calculator https://www.omnicalculator.com/chemistry/boiling-point
    - Water density anomalies https://water.lsbu.ac.uk/water/density_anomalies.html

- Reddit Posts
    - https://www.reddit.com/r/nuclear/comments/1azxc4e/how_can_i_learn_more_about_nuclear_reactor/
    - https://www.reddit.com/r/NuclearPower/comments/1b009lx/how_can_i_learn_more_about_nuclear_reactor/
    - https://www.reddit.com/r/nuclear/comments/1bbh7cl/early_prototype_of_my_pwr_simulatorgame/