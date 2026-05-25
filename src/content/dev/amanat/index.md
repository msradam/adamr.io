---
title: "amanat"
description: "Privacy-first data governance agent for humanitarian NGOs. Every destructive action requires a phone approval."
date: 2026-04-07
featured: true
role: "Hackathon · 1st place"
stack: ["IBM Granite 4", "Auth0 Token Vault", "CIBA", "Python"]
venue: "Auth0 'Authorized to Act' Hackathon · 2026"
recognition: "1st place"
repoURL: "https://github.com/msradam/amanat"
demoURL: "https://msradam-amanat.hf.space"
---

![amanat](/images/amanat.png)

Beneficiary data sits in a tangle of federated systems, and a careless query can put real people at risk. amanat handles credentials through Auth0 Token Vault, requires human-in-the-loop approval for sensitive access via CIBA (a Guardian push to the analyst's phone before any file is deleted or sharing revoked), and reasons over case records on-prem with IBM Granite 4. PII detection runs as a hybrid pipeline combining regex patterns with Granite 4 Micro. Findings are evaluated against ICRC Handbook, IASC Guidance, GDPR, and Sphere Standards via BM25 RAG.

The name (Arabic: أمانة) means a sacred trust, something held in stewardship for someone else.
