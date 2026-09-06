---
title: "kassi"
description: "An AI agent that load-tests a code change, finds the regression in Splunk, and writes the fix. A model-agnostic audited state machine over MCP, driven by any tool-calling model down to a local 8B."
date: 2026-06-14
featured: true
featuredRank: 1
active: true
role: "Solo build"
stack: ["Python", "MCP", "Grafana k6", "Splunk", "Burr", "Claude", "Ollama"]
venue: "Splunk Agentic Ops Hackathon · 2026"
recognition: "Grand Prize Winner"
repoURL: "https://github.com/msradam/kassi"
demoURL: "https://devpost.com/software/kassi-synthetic-load-generation"
excerpt: "Load-tests a diff, correlates the regression against live telemetry, and writes a validated fix. Every transition is streamed back to Splunk."
---

kassi takes a git diff and returns a remediation diff. In between it generates a
[Grafana k6](https://k6.io/) load test against the endpoints the change touches,
runs it, pulls the telemetry back out of Splunk for that exact window, locates
where the system saturated, and writes a fix grounded in what it measured rather
than in what the code looks like.

The point is not that a model can suggest a patch. It is that every step is a
transition on a state machine that the agent cannot leave, and the walk it took
is published back to Splunk as its own trace. You can read what it did in the
same tool you use to read what your services did.

Built on [Theodosia](/dev/theodosia): the workflow is a Burr state machine
mounted as an MCP server, so the model's tools *are* the legal transitions. It
orchestrates two MCP servers it does not own: Grafana's for k6, and Splunk's
official one for search and metrics. The agent has no bespoke integration
surface to drift out of date.

It is model-agnostic on purpose. Any tool-calling model drives it: a frontier
model through Claude, or a local 8B under Ollama for an air-gapped environment,
with IBM Granite in between. The state machine carries the guarantees, so the
model is the part you are allowed to swap.

Validated against [RCAEval](https://github.com/phamquiluan/RCAEval), the WWW'25
root-cause benchmark, and against `go-httpbin` as a control. It won the Grand
Prize at Splunk's Agentic Ops Hackathon.
