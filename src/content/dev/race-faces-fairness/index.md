---
title: "Race, Faces, Fairness"
description: "Auditing commercial face-recognition systems for race and gender bias."
date: 2019-05-01
role: "Research"
stack: ["Python", "Amazon Rekognition", "Sightengine", "UTKFace"]
repoURL: "https://github.com/msradam/race-faces-fairness"
---

Evaluated two commercial gender classification systems (Amazon Rekognition and Sightengine) against the large-scale UTKFace dataset to measure intersectional gender and race disparities. Both systems exhibit bias toward non-white female faces, assigning disproportionately higher male confidence values, and frequently failed on non-white male faces, sometimes failing to detect a face at all.

Built as my final project for the Proseminar in Audiovisual Machine Learning at Wesleyan's Quantitative Analysis Center. Inspired by the Algorithmic Justice League's work and my research on racial disparities in criminal justice.

![UTKFace samples](https://susanqq.github.io/UTKFace/icon/samples.png)
