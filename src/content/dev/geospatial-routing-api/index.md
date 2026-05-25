---
title: "Geospatial Routing API"
description: "Routing math on road networks, built at scale. From my time at UNICEF MagicBox, later revived as Tirtha."
date: 2019-07-01
role: "UNICEF"
repoURL: "https://github.com/msradam/tirtha"
---

Utilities for developers and data scientists to perform geospatial calculations on large datasets based on road networks. Built during my work with UNICEF's MagicBox initiative.

![Geospatial Routing API screenshot](https://raw.githubusercontent.com/msradam/magicbox-routing-api/master/kepler_screenshot.png)

I revived and expanded this work as [Tirtha](https://github.com/msradam/tirtha), which keeps the original notebooks and adds satellite foundation models (IBM/ESA's TerraMind) to estimate per-pixel walkability, then computes how far every populated pixel sits from the nearest clinic, school, water point, or shelter as a fused pixel-and-road graph.
