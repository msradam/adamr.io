---
title: "OpenSidewalks NYC"
description: "The first public, standards-conformant routable pedestrian graph of New York City. Sidewalks, crossings, and curb ramps as first-class features."
date: 2026-05-10
role: "OSS"
stack: ["Python", "OpenStreetMap", "GeoJSON", "OSW v0.3"]
repoURL: "https://github.com/msradam/opensidewalks-nyc"
---

NYC has the densest pedestrian network in North America, and until now there was no public, standards-conformant, routable graph of it. OpenSidewalks NYC is a fully attributed pedestrian graph of all five boroughs: 955,026 features (494,975 nodes, 460,051 edges) with sidewalks, crossings, footways, steps, and curb ramps as first-class objects.

It fuses two sources. OpenStreetMap provides footways, crossings, and the topological scaffold (~210k sidewalks, ~121k crossings, ~184k pedestrian-passable centerlines). NYC DOT's Pedestrian Ramp Locations survey contributes ~187k curb-ramp nodes with measured geometry: running slope, cross slope, counter slope, ADA-violation flags, condition, and tactile paving. Every feature carries `ext:source`, a source timestamp, and a pipeline version for auditability.

The artifact validates 100% against the OpenSidewalks v0.3 schema (Taskar Center for Accessible Technology, University of Washington) and is end-to-end tested with the community's reference routing engine, Unweaver. Released as canonical GeoJSON, FlatGeobuf, GraphML, and per-borough splits. Code Apache-2.0; data ODbL-1.0, inherited from OpenStreetMap.
</content>
