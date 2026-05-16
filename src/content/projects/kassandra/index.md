---
title: "🔮 kassandra"
description: "Mention it on a GitLab merge request and it load-tests your code. Posts the verdict back as a comment."
date: 2026-03-25
repoURL: "https://github.com/msradam/kassandra"
---

![kassandra performance report posted to a GitLab MR](/images/kassandra.png)

Mention `@ai-kassandra-performance-test` on a GitLab MR. The agent reads the diff to find new or changed endpoints, retrieves relevant schemas via OpenAPI GraphRAG (~95% input token reduction), scans for performance anti-patterns (N+1 queries, unbounded SELECTs, missing pagination), generates a k6 script with per-endpoint SLO thresholds, runs it against the live app, and posts a performance report with Mermaid charts as an MR comment. One `AGENTS.md` config per project, no CI YAML changes. Built on the GitLab Duo Workflow Platform for the GitLab AI Hackathon 2026.
