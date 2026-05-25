---
title: "AskStreets: Querying Street Networks with GraphRAG"
description: "A LangGraph ReAct agent that turns natural-language questions about street networks into OSMnx, AQL, and GPU-backed graph algorithms over OpenStreetMap data in ArangoDB. ArangoDB × NVIDIA hackathon, 2nd place."
date: 2025-03-07
topic: "ai-infra"
tags:
  - ai
  - geospatial
  - graphrag
  - agents
---

*Originally published on [Devpost](https://devpost.com/software/askstreets-querying-and-visualizing-street-networks) as my submission to ArangoDB and NVIDIA's "Building the Next-Gen Agentic App with GraphRAG & NVIDIA cuGraph" hackathon (2nd place). Devpost is the original host; this is a mirror.*

---

Using open-source libraries like OSMnx, we can retrieve geographic features and street network datasets from OpenStreetMap and persist them as graphs and collections in ArangoDB. Then, via a LangGraph ReAct agent, we feed natural language queries to LLM-based tools to execute complex lookups, run GPU-backed graph algorithms, and visualize geospatial coordinates. This agentic app enables meaningful insights into the network properties of a geographic location, and empowers us to address real-world infrastructure challenges.

<div class="yt-embed">
  <iframe src="https://www.youtube.com/embed/wF7xZIMomhQ" title="AskStreets: Querying and Visualizing Street Networks" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Inspiration

During my internship at UNICEF Innovation in NYC, I used OpenStreetMap, OSMnx, and NetworkX to calculate distances between schools and health facilities in UNICEF programme countries using national street and road networks. By writing code to execute graph algorithms, I was able to generate data to address a real-world issue.

I wanted to generalize this toward a broader use case. If you're a city planner, business owner, or architect, you may wish to ask questions about street networks (accessibility of services, routed distances between landmarks, crowded intersections) without writing lengthy algorithms. This is where AskStreets comes in: translating natural language queries into street network analysis.

## What It Does

The agentic app uses a LangGraph ReAct agent that accepts user queries and calls multiple tools that can geocode, generate and run AQL, generate and run OSMnx/NetworkX code, and visualize points on a Folium map.

By passing a query to the `query_street_network` function, it invokes the ReAct agent to interpret the query, execute code, and provide a natural language response or map visualization for the specific question.

## How I Built It

I used OSMnx to download street network graphs and geographic features for certain locations, prepared this data to load into ArangoDB, then wrote the LLM-based tools and ReAct agent code. The submission ships two notebook versions: `askstreets-gpu.ipynb`, the hackathon submission with GPU acceleration (RAPIDS/cuGraph) and fully answered query samples, and `askstreets.ipynb` with cleared output and no GPU acceleration.

## Challenges I Ran Into

Prompt engineering was a large aspect of this project. I revised the prompts per tool multiple times as I tested and analyzed the ReAct agent's output, so I could give the models more context to accurately interpret queries and assemble the correct code. Getting the tools to work in tandem, generating the correct intermediate queries to pass between them, was also challenging but rewarding.

## Accomplishments I'm Proud Of

I particularly enjoyed seeing these tools accurately interpret user queries about street networks and correctly identify the geographic attributes to filter or run algorithms against. By loading additional datasets like OpenStreetMap features and health facility data into ArangoDB alongside the graph network, the AQL tool could pull data across these sources to answer queries with a higher degree of specificity.

## What I Learned

I learned how to prepare OSMnx data to load into ArangoDB, how to invoke LLMs and prompt engineer to improve answers, and how to work with the LangChain and LangGraph libraries.

## What's Next

Working with geospatial data has so much potential. By overlaying and combining more datasets, we can enhance the app's ability to answer many query types. The AI tools can be made more precise (different models per tool for their particular use case), more tools can be written (dynamically pulling more data from OpenStreetMap, drawing paths between points), and the prompts can be tuned to avoid redundant operations. The app can be wrapped in a UI that accepts queries and automatically downloads OSM road networks and features from a user-specified location, integrated with a mapping tool like kepler.gl for richer visualization of large geospatial datasets.

This work continued in [DreamStreets](/blog/dreamstreets), which extended the same agent with GPT-OSS-120b's reasoning, and [DreamMeridian](/blog/dream-meridian), which brought offline spatial queries to ARM edge hardware.
</content>
