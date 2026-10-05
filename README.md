# SG Gov

**One stop for everything you need from the Singapore government: just ask.**

**Live demo:** https://hguochen.github.io/sg-gov/

SG Gov is a single, AI-powered front door to Singapore government services. You describe what you need in plain language, such as "How do I renew my passport?", "I'm moving to Singapore for a job. What pass do I need?" or "How do I check my CPF?". SG Gov works out which agency handles it, explains the steps simply, and takes you straight to the official service.

> **Unofficial demo project. It is not affiliated with, or endorsed by, the Government of Singapore.** For anything authoritative, use the official agency sites linked in each answer.

---

## The problem

Singapore's public services are among the most digitised in the world. They are also spread across dozens of ministries, statutory boards and portals, each with its own website, terminology and login flow. To get something done, people often have to know:

- **which agency** owns the task (Is a change of address ICA's job or HDB's? Is a work pass MOM or ICA?)
- **what the scheme is called** (BTO, HFE, MediShield Life, CareShield Life, SkillsFuture, ComCare…)
- **which portal** to use, and what to prepare before logging in

This is hard enough for citizens. It is harder still for new permanent residents, foreign workers, international students and visitors, who may not know the acronyms, the agencies or even where to start.

## The big idea

**Make the government feel like one place.** Instead of learning how the government is organised, you just say what you need. SG Gov:

1. **Understands the question** in everyday language, typos and all, and eventually in Singapore's other official languages too.
2. **Finds the answer only in official government sources.** It never relies on forums, ads or guesswork.
3. **Explains it simply**: what to do, what to prepare, and how long it usually takes.
4. **Hands you off to the real service**, with a direct link to the right page on the official site.

### Who it's for

| Audience | Example questions |
| --- | --- |
| **Singapore citizens** | Renew a passport, check CPF, apply for a BTO flat, NS matters, register a birth or marriage, file taxes |
| **Permanent residents** | Re-entry permits, CPF contributions, housing eligibility, citizenship applications |
| **Foreign workers and professionals** | Work passes, bringing family over, changing employers, tax obligations |
| **International students** | Student passes, part-time work rules, healthcare |
| **Visitors** | Entry requirements, arrival procedures, extending a stay |
| **Business owners** | Registering a company, getting a UEN, licences, GST, hiring staff |

---

## Guiding principles

- **Official sources only.** Every answer is grounded in, and links to, an official government website. If SG Gov can't find an official answer, it says so instead of guessing.
- **Private by default.** No accounts and no ads. Conversations aren't stored, and SG Gov never asks for NRIC numbers, Singpass passwords or payment details.
- **A guide, not a gatekeeper.** SG Gov explains and points the way. Transactions happen on the official agency site, through Singpass where required.
- **Plain language.** It answers in the way a helpful counter officer would talk, not in policy language.
- **No app to install.** It works in any browser on a phone, tablet or computer.
- **Accessible.** Keyboard and screen-reader friendly, readable at any size, and respectful of reduced-motion settings.

---

## Current status: static prototype

This repository is the **front-end prototype**. It shows the experience and the information design. It does not yet include the AI backend.

What works today:

- **"Describe what you need" search**: a curated set of common Singapore topics (passport, CPF, BTO/HDB, National Service, Singpass, business registration, change of address, jobs, park bookings, healthcare financing, income tax, marriage, births, driving and financial support). A lightweight keyword matcher runs entirely in the browser, so nothing typed leaves your device.
- **Answer cards**: each has a plain-language summary, the key steps, and a link to the official agency site. If a question can't be matched, the card offers fallback links to gov.sg and LifeSG.
- **Rotating example questions** with illustrated scenes, to show what you can ask.
- **Agency sphere**: a visual of the many agencies SG Gov brings together.
- **Concept previews** of future features (see the roadmap below).
- **Subpages**: How it works, Privacy and Sources. The Sources table is generated from the same answer data, so it never drifts out of sync.
- Responsive layout, light and dark mode, and reduced-motion support.

The answer summaries are deliberately short and general. Rules, fees and eligibility change, so the linked official source is always the authority.

---

## Roadmap

### Phase 1: Prototype *(this repo)*
Static site, curated answers, keyword matching, deployed on GitHub Pages.

### Phase 2: AI answers grounded in official sources
- A **retrieval-augmented generation (RAG)** pipeline over an index of official government web pages, refreshed regularly.
- A large language model writes short answers **only from retrieved official content**, with inline citations to the source pages.
- Guardrails: refuse or redirect when no official source supports an answer, and flag time-sensitive information.
- Follow-up questions in a conversation ("What if I'm a PR?", "What documents do I need?").
- Support for English, Chinese, Malay and Tamil.

### Phase 3: Personalised guidance
- Answers tailored to your situation (citizen, PR, pass holder or visitor) without storing personal data.
- Step-by-step checklists for life events: moving to Singapore, starting a job, getting married, having a baby, starting a business, retiring.

### Phase 4: Getting things done *(concept)*
- Hand-offs into official services with Singpass, pre-filled where the agency supports it.
- Tracking the progress of applications across agencies in one place.
- Updating details (such as an address) across several agencies in one flow.

The "More coming" section on the home page previews these concepts. They are illustrations only.

---

## Architecture

**Today:**

```
Browser
 ├─ index.html + css/styles.css
 ├─ js/answers.js   curated topics + keyword matcher (client-side)
 └─ js/main.js      UI: examples, answers, menu, sphere, carousel
        │
        └──► links out to official agency websites
```

**Planned (Phase 2+):**

```
Browser (this front end)
   │  question
   ▼
API (serverless)
   ├─ Retriever ──► index of official government pages (scheduled crawl)
   ├─ LLM ──► answer written only from the retrieved passages, with citations
   └─ Guardrails ──► no source, no answer; no personal data stored
   │
   ▼
Answer card + citations ──► official service (Singpass where needed)
```

The static front end stays the same. The keyword matcher in `js/answers.js` will be swapped for a call to the AI API, with the curated answers kept as an offline and fast-path fallback.

---

## Project structure

```
sg_gov/
├─ index.html          Home page: hero search, answers, agencies, features, concept previews
├─ how-it-works.html   How SG Gov finds answers
├─ privacy.html        What is (and isn't) collected
├─ sources.html        Official sources behind each topic (generated from answers.js)
├─ css/styles.css      Design tokens, layout, components, dark mode
├─ js/answers.js       Curated topics and the keyword matcher
├─ js/main.js          Page interactions
├─ img/favicon.svg
└─ .nojekyll           Serve files as-is on GitHub Pages
```

### Adding or editing a topic

Topics live in `js/answers.js`. Each entry looks like this:

```js
{
  id: "passport",
  keywords: ["passport", "renew", "travel"],
  title: "Apply for or renew a Singapore passport",
  summary: "One or two plain-language sentences.",
  steps: ["Step one.", "Step two.", "Step three."],
  sourceName: "ICA",
  sourceUrl: "https://www.ica.gov.sg/",
}
```

The new topic shows up automatically in search results, in the topic chips and on the Sources page. Only link to official government domains.

---

## Running locally

No build step and no dependencies. Serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying

The site is plain static files, ready for **GitHub Pages**: Settings → Pages → Deploy from branch → `main` / root. It will be served at `https://<user>.github.io/sg-gov/`. All paths are relative, so it also works from a sub-path or any other static host.

---

## Disclaimer

SG Gov is an independent, unofficial project. It is not affiliated with, endorsed by or operated by the Government of Singapore or any of its agencies. Agency names are used only to point people to the official services. Information here is general guidance and may be out of date, so always confirm with the official source before acting.
