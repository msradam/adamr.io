---
title: "🧭 ariadne-nyc"
description: "Browser-based accessibility routing assistant for NYC. A 1B-parameter LLM runs on your GPU and dispatches local routing tools. Nothing leaves the browser."
date: 2026-04-26
demoURL: "https://msradam-ariadne-nyc.static.hf.space"
repoURL: "https://github.com/msradam/ariadne-nyc"
---

Type a plain-English question — "cooling centers in Flushing", "Penn Station to Grand Central, wheelchair", or the same in Spanish — and get a route or a list of nearby comfort resources back. A 1B-parameter language model runs on your GPU via WebGPU, picks one of three routing tools (`plan_route`, `find_comfort_and_route`, `find_reachable_resources`), and the app dispatches it against locally-loaded OSM walk graphs and MTA accessibility data. Wheelchair queries filter to ADA-accessible stations with elevators-out-today removed from the set (the only network call after initial assets load). Everything else — the model, the routing, the geocoder — runs entirely in the browser.
