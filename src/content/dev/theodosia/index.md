---
title: "Theodosia"
description: "Mount Burr state machines as MCP servers. An AI agent drives a stateful, auditable workflow one enforced transition at a time."
date: 2026-05-19
featured: true
featuredRank: 4
role: "OSS · PyPI"
stack: ["Python", "Apache Burr", "FastMCP", "MCP"]
repoURL: "https://github.com/msradam/theodosia"
demoURL: "https://msradam.github.io/theodosia/"
---

Theodosia turns a [Burr](https://burr.dagworks.io/) state machine into an MCP server. An agent gets a single `step(action, inputs)` tool. The server enforces graph transitions: call an action that isn't reachable from the current state and you get a structured refusal listing what is reachable. Every step is recorded to a replayable trace. The model can be wrong; the model cannot lie about state.

```python
from theodosia import mount

server = mount(application)
server.run()
```

The four-tool surface (`step`, `reset_session`, `fork_at`, `fork_from_past`) stays constant regardless of FSM complexity. State lives on the server. The reachable action set is the graph, enforced at the protocol layer rather than asked of the model.

Ships with a CLI for session introspection (`theodosia sessions ls`, `theodosia watch`, `theodosia logs --refusals`), OpenTelemetry, and a Burr UI replay. Examples cover order flows, incident response, code review, LLM-in-the-graph, and upstream tool calling.

642 tests. Apache 2.0.
</content>
