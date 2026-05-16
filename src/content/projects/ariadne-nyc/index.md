---
title: "🧭 ariadne-nyc"
description: "Ask NYC how to get somewhere accessible. Everything runs in your browser, nothing leaves the page."
date: 2026-04-26
demoURL: "https://msradam-ariadne-nyc.static.hf.space"
repoURL: "https://github.com/msradam/ariadne-nyc"
---

![ariadne-nyc routing to cooling centers in Flushing](/images/ariadne-nyc.png)

Type a question in plain English ("cooling centers in Flushing", "Penn Station to Grand Central, wheelchair", or the same in Spanish). A 1B-parameter LLM running on WebGPU picks one of three routing tools and dispatches it against locally-loaded OSM walk graphs and MTA accessibility data. Wheelchair queries filter to ADA-accessible stations with elevators-out-today removed (the only network call after assets load). Model, routing, geocoder: all in-browser.
