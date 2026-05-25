---
title: "What Makes a Bookstore a 'Third Place'? I Used AI to Find Out"
description: "Using network analysis and LLM-powered review classification to explore how bookstores in Brooklyn and Queens function as community spaces."
topic: "essays"
date: 2025-10-21
tags: ["data science", "urban planning", "AI", "NYC"]
---

![Third place bookstore analysis](/images/3pp_1.png)

My impulse when traipsing into a new neighborhood in the city: dive into the nearest bookstore, regardless of chain, size, or selection. Those shelves, whether dusty or with metal sheen, draw me in like a magnet – an immediate exploration marker that designates the 'vibe' of a neighborhood for me. This one store often embodies the community it's embedded in.

My local bookstore, Kew and Willow, has become this little hideout for me. I've gone there for hangouts, pin making, open mics, workshops, fairs, and so on. This feeling, of understanding a location as something 'other than' home or workplace – not just another spot to take cover in the rain but a place to affirm identity and engagement – is referred to as a 'Third Place'.

After working on AskStreets, a hackathon project that explored street network analysis with LLMs, I wanted to see if similar computational methods could reveal patterns in how bookstores function as social spaces. This weekend exploration turned into a small research project.

## What's a Third Place?

Sociologist Ray Oldenburg coined the term for spaces that aren't home (first place) or work (second place) – they're the cafes, parks, and yes, bookstores where communities form organically.

Research has been done on measuring the aspects of a "Third Place." Based on the framework from Langlais & Vaux (2022), I used these eight dimensions:

- **Relationship initiation** – meeting new people, maintaining connections
- **Equalizer** – welcoming to all, inclusive environment
- **Communication activity** – conversation as main activity
- **Active/passive engagement** – active participation or passive browsing
- **Reciprocity** – regulars, staff knows customers
- **People over place** – valued for community beyond merchandise
- **Playful mood** – humor, fun atmosphere
- **Cognitive separation** – relaxation, escape from routine

Not all 'Third Places' hit these marks 100%. A study space may be wholly dedicated to cognitive separation with not much emphasis on active social activity, but still be extremely equalizing and devoted to strengthening relationships, like the writer's studio I toured at the Center for Fiction in Brooklyn.

## The Question

Bookstores are unique venues in that, due to their ubiquitous nature and distribution (especially in urban environments), it is unlikely for two bookstores to feel exactly the same. The Kew and Willow near me is very much not like the massive McNally Jackson near Union Square, absolutely crowded and buzzing. Some bookstores are tied to universities and focused more on selling university merchandise or hosting school events, while others fuse coffee shops into their venues to encourage social connection.

In that sense, it is absolutely fascinating to map not only the extent to which each bookstore fulfills these aspects of a Third Place, but also how it's related to the material reality of its physical location. Is a bookstore smack dab in the middle of an urban hub more likely to be a third place because many people walk to it? Or could it be the opposite – a bookstore tucked away and hidden or near a dead end may serve as a better Third Place because it's out of the way and can better fulfill that cognitive separation and satisfy a sense of exploration?

I wanted to explore this relationship with the bookstores in my home borough of Queens (and Brooklyn), using Google Reviews as a way to gauge the qualitative aspects of these stores.

## The Approach

This was an exploratory weekend project, so the methods are straightforward rather than rigorous. I analyzed 60 bookstores across Brooklyn and Queens:

1. Mapped street networks using OpenStreetMap data (via OSMnx)
2. Calculated network centrality for every bookstore (how "central" they are in walking routes)
3. Collected 291 Google reviews via Places API
4. Used an LLM (Qwen 2.5 14B) to classify each review against the eight third place dimensions
5. Analyzed correlations between location centrality and third place characteristics

**Caveats:** The data has limitations. OpenStreetMap coverage varies by neighborhood, Google reviews skew toward certain demographics and experiences, and LLM classification depends heavily on what reviewers choose to mention. Review samples were small (average ~5 per bookstore), and the classification method, while interesting, hasn't been validated against human coding. These results should be seen as exploratory signals rather than definitive findings.

## What I Found

![Aggregate review scores](/images/3pp_2.png)

The hypothesis wasn't supported. Network centrality doesn't predict third place function (r = -0.15, p = 0.24). Being in a busy area or a quiet corner doesn't determine how a bookstore functions socially – at least not in this limited sample with these measurement methods.

But something more interesting emerged when I looked at the patterns in the data. Three distinct bookstore archetypes showed up, with clear geographic clustering:

### Sanctuary

![Sanctuary bookstore archetype map](/images/3pp_sanctuary.png)

Quiet refuges for cognitive separation. High scores on "equalizer" and "cognitive separation," low on "communication activity."

> _Example review (Head Hi): "A peaceful cozy coffee shop... thoughtful art books, delicious coffee."_

### Social Hub

![Social Hub bookstore archetype map](/images/3pp_social.png)

Buzzing conversation and social energy. High scores on "communication activity," "relationship initiation," and "playful mood."

> _Example review (Books Are Magic): "Like being a kid in a candy store. The staff is friendly and knowledgeable... I opened an account to accumulate points."_

### Local Living Room

![Local Living Room bookstore archetype map](/images/3pp_local.png)

Intimate spaces for neighborhood regulars. High scores on "reciprocity," "people over place," and "equalizer." Rare, but unmistakable when present.

> _Example review (Eichler's): "I especially want to mention the cashier, Ronit, who went out of her way to assist me... She's awesome! Without her, the store would feel a big void."_

When customers know staff by name? That's a Local Living Room.

## The Real Pattern

Network position doesn't seem to matter in these data. Neighborhood context might.

Local Living Rooms are rare everywhere. Most Google reviewers don't mention being regulars or knowing staff names. But when they do, it's powerful.

## What I Learned

- **Null results point to alternative explanations.** My hypothesis wasn't demonstrated, but that's valuable: it suggests other factors (neighborhood culture, business model, target audience) matter more than simple network position
- **Computational methods can reveal patterns.** Even with noisy data, I spotted archetype patterns I wouldn't have seen manually reading 291 reviews
- **LLMs are useful signal processors.** Using Qwen for classification turned unstructured review text into analyzable data points, though the method needs refinement
- **Measurement matters.** Google reviews may not capture the full "third place" experience – people don't always write about community aspects

## Limitations Worth Noting

- Small sample size (60 bookstores, ~5 reviews each)
- Review bias (who writes reviews and what they mention)
- OSM data completeness varies by area
- LLM classification spot-checked but not systematically validated at scale
- Cross-sectional snapshot, not longitudinal data

This was a weekend exploration to demonstrate research methods, not a peer-reviewed study. The findings are suggestive and would need replication with better data.

## The Tools

- Python (geopandas, osmnx, networkit)
- OpenStreetMap for network data
- Google Places API for reviews
- Qwen 2.5 14B for classification
- Folium for interactive mapping

Interactive maps and full methodology: [github.com/msradam/third-place-persona](https://github.com/msradam/third-place-persona)

## References

Langlais, M. R., & Vaux, D. E. (2022). Establishing and Testing a Quantitative Measure for Evolving Third-Place Characteristics. _International Journal of Technology and Human Interaction_, 18(1), 1-15.
