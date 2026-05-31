---
title: "fromjcl"
description: "Parse IBM z/OS JCL into a typed Python model, then serialize it to JSON, YAML, CSV, or byte-exact JCL."
date: 2025-11-28
featured: true
featuredRank: 7
active: true
role: "OSS · PyPI"
stack: ["Python", "z/OS", "JCL", "ZOAU"]
repoURL: "https://github.com/msradam/fromjcl"
demoURL: "https://pypi.org/project/fromjcl/"
---

![fromjcl](https://raw.githubusercontent.com/msradam/fromjcl/main/docs/demo.gif)

`fromjcl job.jcl --to json` turns IBM z/OS Job Control Language into a typed Python model you can serialize to JSON, YAML, CSV (one row per step/DD/dataset), or back to byte-exact JCL. The parser is a pure-Python port of [Mike Fulton's JCLParser](https://github.com/MikeFultonDev/JCLParser), with byte-exact roundtrip enforced on every commit against an 83-sample corpus drawn from `IBM/*`, `zowe/*`, and hand-authored paraphrases.

Pure Python (3.12+), so the same wheel installs under IBM Open Enterprise Python on z/OS as well as Linux, macOS, and Windows. An optional `[zoau]` extra translates each step into its closest Z Open Automation Utilities shell equivalent. Apache 2.0, on PyPI.
</content>
