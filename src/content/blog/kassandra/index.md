---
title: "Kassandra: An AI Performance Testing Agent for Merge Requests"
description: "A GitLab Duo Workflow agent that turns code diffs into k6 load tests, runs them against the live app, and posts the verdict back to the MR. Caught a SQLite thread-safety bug invisible in serial testing."
date: 2026-03-25
topic: "observability"
tags:
  - ai
  - agents
  - load testing
  - observability
---

*Originally published as my submission to the GitLab AI Hackathon 2026, hosted on GitLab. This is a mirror; the [original submission and published agent](https://gitlab.com/gitlab-ai-hackathon/participants/3286613) live on GitLab.*

---

Kassandra is a Duo Workflow agent that auto-generates [Grafana k6](https://k6.io/) load tests from GitLab merge request diffs, executes them against the live application, and reports real runtime results. Mention Kassandra on an MR and it handles the rest: reads the diff, retrieves relevant API schemas via OpenAPI GraphRAG, generates a load test, starts the app, runs k6, and posts a performance report with actual latency numbers, Mermaid charts, and regression detection. No tests to write. No pipelines to configure. One config file per project.

<div class="yt-embed">
  <iframe src="https://www.youtube.com/embed/Hwx-1og5emU" title="Kassandra: AI Performance Test Agent | GitLab AI Hackathon 2026" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Why Performance Testing Matters

Some bugs only appear under load. A SQLite endpoint that passes every unit test can fail 60% of requests when concurrent users hit it, because thread-safety constraints only surface under real concurrency. Unit tests verify logic. Load tests verify behavior under production conditions. They catch different classes of bugs.

But performance testing doesn't scale with development velocity. Teams ship endpoints faster than they can test them. Someone still has to write and maintain the load test scripts. Most teams don't. I raised this with a member of the Grafana k6 team at ObservabilityCon 2025; he confirmed that script maintenance is a consistent pain point they see across k6 users.

[Grafana k6](https://k6.io/) supports shift-left testing. [Schemathesis](https://schemathesis.io/) does schema-based fuzzing. [Dredd](https://dredd.org/) does contract validation. None of them read a diff, generate a targeted load test, run it, and post the results back to the MR. To my knowledge, no existing tool closes this loop.

This is where an LLM fits. Generating a correct k6 script from a diff requires understanding endpoint semantics, choosing request bodies, writing validation logic, and deciding what a reasonable SLO looks like per endpoint. That's a language understanding and code generation problem.

## Inspiration

Last year I [ported Grafana k6 to IBM z/OS mainframes](https://medium.com/theropod/go-ing-native-porting-grafana-k6-to-z-os-with-go-f7f73267c1c), compiling it natively so it could run 24/7 on the same machine. That project convinced me k6 is the right engine: cloud native, scriptable, runs anywhere. Kassandra takes k6 to its logical extreme: an AI agent writes the test from the merge request diff.

The name comes from Greek mythology. Kassandra had the gift of prophecy but was cursed so no one would believe her. This Kassandra sees your performance problems before production does, and posts the proof where you can't ignore it.

## What It Does

Kassandra is the full loop: diff to test to execution to verdict. It generates a k6 load test, deploys the application, runs concurrent virtual users against it, and reports what actually happened under load.

On one MR, every API call returned the correct response. The endpoint worked perfectly in serial. Under load, the endpoint failed 60.6% of requests. Kassandra diagnosed the root cause autonomously: SQLite thread-safety under FastAPI's thread pool. On another, it caught an Express.js route ordering bug: 100% failure rate, root cause diagnosed, fix recommended. No human prompted it to look for either issue.

Comment `@ai-kassandra-performance-test` on any GitLab merge request. Kassandra:

1. **Reads the actual code diff** to identify new or changed API endpoints from route declarations
2. **Retrieves relevant schemas** via OpenAPI GraphRAG (~95% token reduction, A/B verified)
3. **Scans the diff for risks**: N+1 queries, unbounded SELECTs, `fetchall()`, missing pagination
4. **Generates a k6 load test** with open-model executors, per-endpoint SLO thresholds, and deep response validation
5. **Commits the test** to the MR branch
6. **Runs the test**: starts the app, executes k6, shuts everything down
7. **Posts the report**: Mermaid latency charts, threshold tables, per-endpoint breakdowns, regression detection

No CI YAML changes. No per-project agent code. One `AGENTS.md` config per project.

### Results

Kassandra was triggered 37 times across MRs during active development. 23 runs completed end-to-end: the agent generated a valid k6 script, started the application, executed the test, and posted a structured report. Every run that reached k6 execution produced a valid report.

| MR | App | Requests | VUs | p95 | Outcome |
|----|-----|----------|-----|-----|---------|
| !39 | Calliope Books (Node/Express) | 576 | 55 | 1.5ms | **Route ordering bug: 100% failure** |
| !41 | Hestia Eats (TypeScript/Hono) | 728 | 75 | 1.1ms | Clean, 8/8 thresholds |
| !69 | Midas Bank (Python/FastAPI) | 2,828 | 60 | 47.0ms | **SQLite thread-safety: 60.6% failure** |
| !74 | Midas Bank (Python/FastAPI) | 2,830 | 60 | 3.6ms | Memory exhaustion risk (`fetchall`) |
| !75 | Calliope Books (Node/Express) | 306 | 60 | 5.4ms | Clean, 4,000+ validation checks |

Aggregate across all 23 completed runs: ~24,400 requests, up to 75 concurrent virtual users, peak 113 req/s. Every run is a real k6 execution against a running server with parallel load, not static analysis or mocked responses.

The data also contains subtler signal. The `spending_trends` endpoint on Midas Bank was tested across 13 runs: at 5 VUs, p95 was 3.7-4.1ms; at 13 VUs it jumped to 8.4ms (+127%); with the thread-safety bug it exploded to 47.0ms. The latency degradation was visible across runs before the catastrophic failure.

## How I Built It

**Platform:** GitLab Duo Workflow with tools for reading the MR, listing diffs, reading files, running commands, creating files, committing, and posting MR notes. The Duo Workflow sandbox runs Anthropic models by default.

### OpenAPI GraphRAG

Kassandra's k6 scripts run unsupervised against a live server. A wrong field name in a validation check means a misleading test failure. Dumping a full OpenAPI spec into the prompt forces the model to chase `$ref` pointers at inference time while simultaneously writing a k6 script. GraphRAG pre-resolves those `$ref` chains into an explicit typed tree: every field pre-associated with its parent schema and endpoint. The model gets only the schemas reachable from the changed endpoints.

The result: zero hallucinated endpoints and ~95% fewer input tokens across all A/B test scenarios. Implemented as a zero-dependency custom `DiGraph` (114 lines, standard library only). 57 unit tests.

A/B tested with Qwen 2.5 Coder 7B running locally via Ollama: the 7B model achieved perfect schema coverage on two of three tests and outperformed full-spec prompting on the third (where the full spec drowned the small model in noise), with 33-68% faster inference. The graph retrieval is model-agnostic.

### Key Design Decisions

**Open-model executors only.** Closed-model executors reduce load when the server slows down, hiding the regressions you're testing for. Kassandra exclusively generates open-model executors that maintain consistent throughput.

**Deterministic reporting.** The LLM produced broken Mermaid charts 20% of the time. Report generation is now a deterministic Python script: k6 JSON to Markdown with color-themed charts. The LLM reasons. Python charts. k6 executes.

**Single-invocation execution.** Duo Workflow's `run_command` blocks until exit. One shell script handles the full lifecycle in one process: app startup, health check, risk analysis, GraphRAG, k6, report generation, cleanup.

## Challenges I Ran Into

**Non-deterministic orchestration.** Duo Workflow routes tools via an LLM, so the same prompt can produce different tool sequences across runs. 14 of 37 triggers didn't produce reports, but these were spread across active development: prompt revisions, new features, flow restructuring. This is what iterating on an agentic system looks like: trigger, observe, adjust, retrigger.

**Context limits.** Long prompts cause the agent to enter tool-routing loops. Structuring the prompt as a strict numbered checklist and keeping dynamic context minimal via GraphRAG was the key fix.

**Process lifecycle.** `run_command` blocks until exit, so starting the app and k6 in separate calls leaves the server hung. A single shell script with a trap handler solved it.

## What I Learned

- **Restructured context beats trimmed context.** Reducing token count wasn't enough; the model hallucinated endpoints from the full spec even when told to test only changed endpoints. The fix was changing the representation so the ambiguity was gone before the model saw it.
- **Don't let the LLM generate structured syntax.** Mermaid, YAML, k6 thresholds. 80% reliability means 20% broken charts. Deterministic generation from structured data is the only reliable path.
- **Lean on battle-tested tools.** The agent's job is to generate the right script and interpret results, not reinvent the load testing engine. k6 handles the hard parts.
- **Split LLM and deterministic work explicitly.** Every time I let the LLM cross into deterministic territory, reliability dropped.
- **Deterministic retrieval scales across models.** A 7B local model produced zero hallucinations with GraphRAG context, because the hard work happens before the model sees anything.

## What's Next

- **Automated baseline comparison**: auto-run on merge to main to build baselines and flag >10% p95 drift
- **Multi-protocol support**: GraphQL's introspection schema is natively graph-structured, a natural fit for the same BFS retrieval
- **SLO alerting**: auto-create GitLab issues when performance degrades across runs
</content>
