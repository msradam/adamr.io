---
title: "DreamMeridian: GeoAI on a Raspberry Pi"
description: "Natural-language spatial queries running entirely offline on a Raspberry Pi 5. A quantized xLAM-2-1B model plus graph routing answers humanitarian questions with no cloud, no GPU. ARM AI Developer Challenge, 2nd of 1,600+."
date: 2025-12-01
topic: "ai-infra"
tags:
  - ai
  - geospatial
  - edge
  - humanitarian
---

*Originally published on [Devpost](https://devpost.com/software/dreammeridian) as my submission to the ARM AI Developer Challenge 2025 (2nd place, 1,600+ participants). Devpost is the original host; this is a mirror.*

---

DreamMeridian answers natural language spatial queries entirely on-device on a Raspberry Pi 5. Ask "Find hospitals within 2km of Camp 8W" in Cox's Bazar, "How do I walk from Condado to Santurce?" in San Juan, or "Is there a pharmacy near Gelora?" in Jakarta, and get real answers with walking routes and distances in under 11 seconds. No internet, no cloud, no GPU. Just a $120 ARM board running at under 10 watts.

<div class="yt-embed">
  <iframe src="https://www.youtube.com/embed/80KqDcOSRPc" title="DreamMeridian: GeoAI on Pi" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Inspiration

At UNICEF Innovation, I built algorithms to calculate distances between schools and health facilities across programme countries. It worked, but required connectivity, cloud compute, and coding expertise that field workers don't have.

Hurricane Maria showed what happens when that infrastructure fails. Within two days, 95.6% of Puerto Rico's cell sites went down (FCC, 2017). The island lost power for months; excess mortality reached 2,975 in the six months following (Santos-Burgoa et al., 2018). This pattern repeats. After the 2023 Turkey-Syria earthquake, connectivity failed across affected regions during the critical 72-hour rescue window. When networks fail, cloud-based tools fail with them. And 2.6 billion people remain offline globally even without disasters (ITU, 2024).

Offline data collection has mature solutions; KoBoToolbox serves 32,000+ organizations. Offline map viewing and POI search exist in consumer apps like OsmAnd. But natural language spatial queries on low-power edge hardware remain unavailable. A field worker can collect a GPS point, view a map, and search for nearby POIs, but cannot ask "How many people live within walking distance of this clinic?" without exporting to desktop GIS software or reaching headquarters.

DreamMeridian fills this gap: natural language spatial queries on an ARM single-board computer, entirely offline. No GIS training required to run queries.

## What It Does

DreamMeridian is an on-device spatial query engine. You ask questions in natural language; it returns walking routes, distances, and POI locations from a local OpenStreetMap database and precomputed road network graph.

UNHCR mandates that 80% of refugees must be within one hour's walk of a health facility. Sphere standards require households within 500 meters of water points. These standards can be verified with existing GIS tools, but not easily in the field without specialized training. DreamMeridian enables queries like "Find the nearest hospital to Bambu Apus" or "What can I reach in 15 minutes from Camp 12?"

### Architecture

```
Natural Language Query  →  Geocoding Layer ("Camp 6" → lat/lon)
                        →  xLAM-2-1B (Q5_K_M) via llama.cpp, GBNF grammar
                        →  Spatial Tools
                              ├─ DuckDB + Spatial  (POI queries, geocoding)
                              └─ NetworKit         (Dijkstra routing on road graph)
                        →  Result + Map
```

### Spatial Tools

Six functions the LLM can call: `list_pois`, `find_nearest_poi_with_route`, `calculate_route`, `find_along_route`, `generate_isochrone`, and `geocode_place`.

### Pre-Built Datasets

Three disaster response scenarios with offline data, sourced from OpenStreetMap via OSMnx:

| Location | Context | Graph Nodes | POIs |
|----------|---------|-------------|------|
| Cox's Bazar, Bangladesh | Rohingya refugee camps | 27,551 | 6,509 |
| San Juan, Puerto Rico | Hurricane response | 24,602 | 11,351 |
| Jakarta, Indonesia | Urban flood response | 208,281 | 41,028 |

## ARM Optimization

### Why Raspberry Pi 5

The Cortex-A76 was chosen over Pi 4's Cortex-A72 for its dot product extensions. The A76 supports SDOT/UDOT instructions that accelerate INT8 multiply-accumulate operations, critical for quantized LLM inference. The A72 lacks these entirely, falling back to slower scalar operations. Published benchmarks show the Pi 5 delivers 2-3x the CPU performance of Pi 4 (Raspberry Pi, 2023).

### Full-Stack ARM Efficiency

Every layer is optimized for ARM edge deployment: llama.cpp built with `-mcpu=cortex-a76` to enable hand-written NEON intrinsics with DotProd acceleration; DuckDB's columnar-vectorized execution targeting NEON; NetworKit's OpenMP parallelization across all 4 cores; DietPi's ~400MB base footprint. The result: a full GIS + LLM stack in under 4GB RAM.

### Why xLAM-2-1B

Small LLMs typically struggle with structured tool-calling, which is why specialized models exist. Salesforce's xLAM-2-1b-fc-r was trained specifically for function calling on 60,000 examples across 3,673 executable APIs (Liu et al., 2024), achieving top-tier rankings on the Berkeley Function-Calling Leaderboard. Q5_K_M quantization compresses the model to ~1.1GB while preserving accuracy.

## How I Built It

`build_location.py` resolves a location string to coordinates via Nominatim, downloads the street network via OSMnx, converts the NetworkX graph to NetworKit's binary format, queries OSM for humanitarian-relevant POIs, extracts place names for geocoding, and loads everything into a DuckDB database with spatial indexes. The resulting files are compact and portable (Cox's Bazar: ~7MB, Jakarta: ~32MB).

At runtime everything happens locally; no network calls. I simulated field conditions by disconnecting the Pi from the network and running the full query suite successfully.

Key decisions: GBNF grammar constraints force valid JSON tool calls at the token level, virtually eliminating parsing failures. A dedicated geocode layer matches OSM place names with longest-match-first ordering (so "Camp 8E" matches before "Camp 8"). NetworKit over NetworkX: published benchmarks show 10x-2000x speedups depending on the algorithm, which translates to sub-second routing.

## Benchmark Results

10-query cross-platform benchmark (warm cache, post-warmup):

| Platform | Architecture | Mean | tok/s | TDP | Cost |
|----------|-------------|------|-------|-----|------|
| M3 MacBook Air | Apple Silicon | 1.14s | 60.3 | ~20W | ~$1,099 |
| Steam Deck | x86-64 Zen 2 | 3.94s | 20.4 | ~15W | ~$400 |
| Raspberry Pi 5 | ARM Cortex-A76 | 8.60s | 9.5 | ~5W | ~$120 |

The Steam Deck comparison isolates the architecture question: similar thermal envelope, similar-era silicon, different ISA. The Pi 5 delivers an estimated 38% more queries per watt-hour (~84 vs ~61 on a 100Wh battery). In disaster zones running on solar or generator power, efficiency matters more than speed.

On the full 57-query Pi 5 suite: 95.0% success rate, 10.87s average response, 8.9 tok/s. The 3 failures share a pattern: the LLM defaulted to isochrone generation for ambiguous "where is nearest" queries, addressable via few-shot prompting.

## Challenges

**Model selection and latency.** Tested several 1-3B models before landing on xLAM-2-1b-fc-r. General-purpose small LLMs failed at structured tool-calling and ran slower.

**Geocoding without an API.** Built a dedicated layer that loads OSM place names into memory and matches with word boundaries, handling "Camp 8E" vs "Camp 8" correctly.

**Reliable JSON generation.** GBNF grammar constraints in llama.cpp force valid JSON structure at the token level, virtually eliminating parsing failures.

## What I Learned

- Specialized small models beat general large models for structured tasks.
- Grammar-constrained generation dramatically reduces JSON parsing errors.
- LLM inference is the bottleneck on edge hardware; optimize there first.
- C++ matters at the edge: NetworKit vs NetworkX shows 10x-100x+ speedups on shortest-path algorithms.
- Data preparation is the real work. The LLM is only as good as what it can query.

## What's Next

**Near-term**: voice input via local Whisper, GPS module for current-location queries. **Medium-term**: public CLI pipeline for any OSM location, HDX integration for crisis region datasets, tool chaining for compound queries. **Long-term**: Pi AI HAT+ (Hailo-8L NPU) support, ruggedized enclosures with solar integration, testing on other ARM devices like NVIDIA Jetson Nano.
</content>
