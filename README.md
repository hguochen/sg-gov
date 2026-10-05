# SG Gov

A static website that acts as one front door to Singapore government services: describe what you need and it shows a short answer with a link to the official Singapore government source.

> **Unofficial demo project. It is not affiliated with, or endorsed by, the Government of Singapore.** For anything authoritative, use the official agency sites linked in each answer.

## Stack
Plain HTML, CSS and JavaScript with no build step and no dependencies. It is meant to be published on GitHub Pages.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Structure
- `index.html`: home page
- `how-it-works.html`, `privacy.html`, `sources.html`: subpages
- `css/styles.css`: styles, including dark mode
- `js/main.js`: interactions (rotating examples, menu, sphere, carousel)
- `js/answers.js`: curated Q&A data and the keyword matcher
