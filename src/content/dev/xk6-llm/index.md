---
title: "xk6-llm"
description: "Load test LLM inference servers with k6. TTFT, ITL, TPOT, goodput, cost, and energy metrics for any OpenAI-compatible server."
date: 2026-05-15
active: true
featured: true
featuredRank: 6
role: "IBM · OSS"
stack: ["Go", "Grafana k6", "Prometheus"]
venue: "IBM Open Source · 2026"
repoURL: "https://github.com/msradam/xk6-llm"
---

![xk6-llm demo](/images/xk6-llm.gif)

Drives any OpenAI-compatible endpoint (vLLM, TGI, llama.cpp, hosted APIs) under realistic concurrency and reports the metrics that matter for serving: time-to-first-token, inter-token latency, tokens per output token, goodput under SLO, plus per-request cost and energy. Results land in Prometheus and Grafana for live dashboards.
