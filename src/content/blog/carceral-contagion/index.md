---
title: "Carceral Contagion: Modeling Incarceration as an Epidemic"
description: "An agent-based simulation that treats mass incarceration as a contagion spreading through a population network, after Lum et al's work on the racial disparities of imprisonment. Built in Mesa with a NetworkX backend."
date: 2019-08-10
tags:
  - simulation
  - social justice
  - modeling
  - criminal justice
---

*Adapted from the project's submission writeup. The simulation code lives on [GitHub](https://github.com/msradam/carceral-contagion).*

---

Carceral Contagion simulates the infectious properties of mass incarceration through a synthetic agent-based population network, inspired by Lum et al's "The Contagious Nature of Imprisonment."

![Screenshot of the simulation](https://raw.githubusercontent.com/msradam/carceral-contagion/master/screenshot.png)

## Inspiration

Lum et al. describe racial disparities in mass incarceration in the United States as informed by the socioeconomic issues that occur in communities when members are incarcerated. This project simulates that phenomenon by initializing a network of individuals with relationships to one another, each carrying a chance of "infecting" another individual with the possibility of being incarcerated. This is an abstraction of the complex relationships between real people that can result in imprisonment, such as increased poverty or the lack of parental figures, but is sufficient to illustrate how mass incarceration is akin to an epidemic with spiraling effects.

## Implementation

The simulation is built in Mesa, with NetworkX as the graph backend. Each individual is initialized with a randomized sex and set of relationships. The probabilities for incarceration risk are derived from a study used by Lum et al. that surveyed families of incarcerated persons. Once incarcerated, each individual is assigned a sentence length based on the median sentencing lengths by race for the simulated population.

The model is based on the susceptible-infected-susceptible (SIS) model: once individuals have been released, they still have a chance of "infecting" other individuals, and do not recover. That recurring susceptibility is what makes incarceration behave like a contagion across the network rather than a one-time event.

## Citations

1. Kristian Lum, Samarth Swarup, Stephen G. Eubank, James Hawdon, "The Contagious Nature of Imprisonment: An Agent-based Model to Explain Racial Disparities in Incarceration Rates," J. R. Soc. Interface 11(98):20140409, June 2014.
2. Dallaire DH. 2007. "Incarcerated mothers and fathers: a comparison of risks for children and families." Family Relations 56, 440-453.
</content>
