---
title: "⚡ xk6-llm"
description: "k6 extension that load tests LLM inference servers. TTFT, ITL, goodput, cost, energy. Streams to Prometheus and Grafana."
date: 2026-05-15
repoURL: "https://github.com/msradam/xk6-llm"
---

![xk6-llm demo](/images/xk6-llm.gif)

Drives any OpenAI-compatible endpoint (vLLM, TGI, llama.cpp, hosted APIs) under realistic concurrency and reports the metrics that matter for serving: time-to-first-token, inter-token latency, tokens per output token, goodput under SLO, plus per-request cost and energy. Results land in Prometheus and Grafana for live dashboards.
