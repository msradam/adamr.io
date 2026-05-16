---
title: "⚡ xk6-llm"
description: "A load test for LLM servers. Reports the numbers that actually matter for serving."
date: 2026-05-15
repoURL: "https://github.com/msradam/xk6-llm"
---

![xk6-llm demo](/images/xk6-llm.gif)

Drives any OpenAI-compatible endpoint (vLLM, TGI, llama.cpp, hosted APIs) under realistic concurrency and reports the metrics that matter for serving: time-to-first-token, inter-token latency, tokens per output token, goodput under SLO, plus per-request cost and energy. Results land in Prometheus and Grafana for live dashboards.
