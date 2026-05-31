---
title: "xk6-tn3270 & Mainframe Tooling"
description: "Modern load testing for mainframe terminals. Grafana k6 extension for 3270 TN3270 protocol."
date: 2025-01-01
active: true
featured: true
featuredRank: 8
role: "IBM · OSS"
stack: ["Go", "Grafana k6", "z/OS", "3270"]
venue: "IBM Open Source · 2025"
repoURL: "https://github.com/msradam/xk6-tn3270"
---

![z/OS load testing](/images/locust-zos.gif)

A Grafana k6 extension that lets you load-test IBM mainframe applications over the TN3270/TN3270E protocol. Runs concurrent virtual users with per-VU subprocess isolation via s3270, supports all standard 3270 operations (PF/PA keys, Enter, Tab, Clear), and captures screen contents for assertion and debugging. Builds on z/OS with specific USS environment configuration. Companion to k6port, a native z/OS port of the k6 binary.
