---
title: "⚡ xk6-llm"
description: "Load test LLM inference servers with k6. TTFT, ITL, TPOT, goodput, cost, and energy metrics for any OpenAI-compatible server, shipped to Prometheus and Grafana."
date: 2026-05-15
repoURL: "https://github.com/msradam/xk6-llm"
---

A Grafana k6 extension for benchmarking LLM inference servers. Drives any OpenAI-compatible endpoint (vLLM, TGI, llama.cpp, hosted APIs) under realistic concurrency and reports the metrics that actually matter for serving: time-to-first-token, inter-token latency, tokens per output token, goodput under SLO, and per-request cost and energy. Streams results to Prometheus and Grafana for live dashboards.
