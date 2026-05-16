---
title: "🔮 kassandra"
description: "Performance testing agent for GitLab merge requests. Reads the diff, generates a k6 load test, runs it against the live app, and posts a performance report as an MR comment."
date: 2026-03-25
repoURL: "https://github.com/msradam/kassandra"
---

Mention `@ai-kassandra-performance-test` on a GitLab MR and the agent reads the actual code diff to identify new or changed API endpoints, retrieves relevant schemas via OpenAPI GraphRAG (~95% input token reduction), scans for performance anti-patterns (N+1 queries, unbounded SELECTs, missing pagination), generates a k6 script with open-model executors and per-endpoint SLO thresholds, runs it against the live application, and posts a performance report with Mermaid charts and threshold tables as an MR comment. No test authoring, no CI YAML changes — one `AGENTS.md` config file per project. Built on the GitLab Duo Workflow Platform for the GitLab AI Hackathon 2026.
