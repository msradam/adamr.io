---
title: "ariadne-nyc"
description: "Ask NYC how to get somewhere accessible. A 1B-parameter model runs on your GPU. Nothing leaves the browser."
date: 2026-04-26
featured: true
role: "Hackathon"
stack: ["Granite 4.0 1B", "WebGPU", "Rust/WASM", "SvelteKit"]
venue: "Code4City · NYU CUSP · 2026"
demoURL: "https://msradam-ariadne-nyc.static.hf.space"
repoURL: "https://github.com/msradam/ariadne-nyc"
---

![ariadne-nyc routing to cooling centers in Flushing](/images/ariadne-nyc.png)

Type a question in plain English or Spanish ("cooling centers in Flushing", "Penn Station to Grand Central, wheelchair"). A 1B-parameter Granite 4.0 model running on WebGPU picks one of three routing tools and dispatches it against locally-loaded OSM walk graphs and MTA accessibility data. The router is compiled to WASM from Rust (Dijkstra over petgraph + rstar). Wheelchair queries filter to ADA-accessible stations with elevators-out-today removed (the only network call after assets load). Model, router, geocoder: all in-browser. After the initial asset download you can go offline and the app still produces routes.
