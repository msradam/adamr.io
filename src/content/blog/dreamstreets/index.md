---
title: "DreamStreets: GPT-OSS-Powered Geospatial Insights"
description: "Extending AskStreets with GPT-OSS-120b's chain-of-thought reasoning for urban planning and humanitarian response, running offline on an A100 with RAPIDS GPU acceleration. OpenAI Open Model Hackathon."
date: 2025-09-01
topic: "ai-infra"
tags:
  - ai
  - geospatial
  - agents
  - reasoning
---

*Originally written as my submission to the OpenAI Open Model Hackathon. The project extends [AskStreets](/blog/askstreets); the code lives on [GitHub](https://github.com/msradam/dreamstreets-hackathon).*

---

DreamStreets extends [AskStreets](/blog/askstreets) with GPT-OSS-120b's advanced reasoning. It uses OpenAI's open-weight 120B model to perform chain-of-thought reasoning over geospatial questions, generating and executing graph algorithms and spatial queries to provide actionable insights for both urban planning and humanitarian contexts.

<div class="yt-embed">
  <iframe src="https://www.youtube.com/embed/0IjroZbPUL8" title="DreamStreets: AI-Powered Geospatial Insights" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## What It Does

DreamStreets leverages GPT-OSS-120b to:

- Generate and execute NetworkX graph algorithms for network analysis
- Create spatial SQL queries for POI and facility analysis
- Perform chain-of-thought reasoning to break down complex urban planning questions
- Provide actionable insights for urban planning and humanitarian response

### Key Applications

- **Urban Planning**: optimal business locations, infrastructure vulnerability assessment
- **Public Health**: emergency response gap identification, route planning
- **Humanitarian Response**: refugee camp resource placement, flood preparedness
- **Emergency Management**: evacuation planning, critical bottleneck identification

## Technical Architecture

- **LLM**: GPT-OSS-120b (120B parameters) via Ollama, completely offline
- **Scientific Computing**: RAPIDS AI 25.10a with CUDA 12.9 for GPU-accelerated data processing
- **Graph Analysis**: NetworkX with OSMnx for geospatial enhancement and nx-cugraph for GPU acceleration
- **Spatial Database**: DuckDB with spatial extensions
- **Agent Framework**: LangGraph ReAct agent with specialized tools
- **Data Source**: OpenStreetMap via OSMnx

## Why GPT-OSS-120b

This project explores OpenAI's most powerful open-weight model for geospatial reasoning. Key advantages:

- **Complete offline operation**, critical for field deployment in low-connectivity areas and under data regulation
- **Transparent chain-of-thought**, so we can audit the full reasoning process for debugging and trust
- **Proven tool use** on agentic workflows
- **Efficient MoE architecture**: only 5.1B active parameters per token despite 117B total

The model's unsupervised chain-of-thought is particularly valuable for urban planning: decision-makers can audit the reasoning behind infrastructure recommendations. Running locally ensures data sovereignty for sensitive government and humanitarian datasets.

### Why RAPIDS + LLMs

This project demonstrates the synergy between established scientific computing tools and language models. The RAPIDS ecosystem provides battle-tested GPU acceleration for data manipulation, while GPT-OSS-120b adds natural language understanding and code generation. The combination lets domain experts leverage complex algorithms without writing code, integrating smoothly with their GIS workflow.

## Deployment

Deployed on Runpod with the `rapidsai/notebooks:25.10a-cuda12.9` base image and a JupyterLab environment. Hardware: NVIDIA A100 SXM (80GB VRAM), 250GB system RAM, at roughly $1.55-1.74/hr. This was my first experience running large models on enterprise GPUs.

## Key Achievements

- Chain-of-thought reasoning for complex spatial problems
- Dynamic code generation for NetworkX algorithms and SQL queries
- Multi-tool orchestration combining graph and database analysis
- Complete offline operation, critical for field deployment and compliance

On performance: it analyzes networks with hundreds of nodes in seconds, initializes the model once per session (30-second warmup), and processes complex multi-step queries with up to 25 reasoning iterations, with no ongoing API costs after setup.
</content>
