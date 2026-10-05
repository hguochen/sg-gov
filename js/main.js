(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Rotating examples + illustrated scenes ----------
  // Each example pairs a prompt with a simple illustrated scene (no photos needed).
  const EXAMPLES = [
    { q: "How do I renew my passport?", caption: "Travel documents", sky: ["#f6b56b", "#e1677a"], motif: "plane" },
    { q: "How do I check my CPF balance?", caption: "Retirement savings", sky: ["#7fb8d8", "#2f5f8a"], motif: "coins" },
    { q: "How do I apply for a BTO flat?", caption: "Housing", sky: ["#a5d6c8", "#3f7f78"], motif: "flats" },
    { q: "When is my NS enlistment?", caption: "National Service", sky: ["#b9c48d", "#4d5d36"], motif: "badge" },
    { q: "How do I set up Singpass?", caption: "Digital identity", sky: ["#b4a7e6", "#4a3c8c"], motif: "phone" },
    { q: "How do I register my new business?", caption: "Business", sky: ["#f2d27b", "#c0782f"], motif: "shop" },
    { q: "I’m moving. How do I change the address on my NRIC?", caption: "Moving home", sky: ["#f3b4a2", "#9b4c5f"], motif: "box" },
    { q: "Help me find a job", caption: "Careers", sky: ["#9fd0f0", "#2d6aa3"], motif: "briefcase" },
    { q: "How do I book a campsite at East Coast Park?", caption: "Parks & nature", sky: ["#ffd29a", "#2f6d5a"], motif: "tent" },
    { q: "What does MediShield Life cover?", caption: "Healthcare", sky: ["#bfe3f2", "#3a7ca5"], motif: "health" },
  ];

  const MOTIFS = {
    plane: '<g transform="translate(560 120) rotate(-12)" fill="#fff"><path d="M-70 0 L60 -8 Q80 0 60 8 Z"/><path d="M-10 -4 L-40 -50 L-22 -50 L20 -5 Z"/><path d="M-10 4 L-40 50 L-22 50 L20 5 Z"/><path d="M-62 -2 L-78 -24 L-68 -24 L-50 -3 Z"/></g>',
    coins: '<g fill="#ffe29a" stroke="#c8962a" stroke-width="4"><ellipse cx="560" cy="300" rx="70" ry="22"/><ellipse cx="560" cy="275" rx="70" ry="22"/><ellipse cx="560" cy="250" rx="70" ry="22"/><ellipse cx="660" cy="300" rx="60" ry="20"/><ellipse cx="660" cy="278" rx="60" ry="20"/></g>',
    flats: '<g fill="rgba(255,255,255,.92)"><rect x="470" y="150" width="90" height="250" rx="6"/><rect x="580" y="110" width="100" height="290" rx="6"/></g><g fill="#3f7f78" opacity=".5">' +
      Array.from({ length: 8 }, (_, r) => `<rect x="485" y="${170 + r * 28}" width="60" height="12" rx="2"/><rect x="597" y="${130 + r * 32}" width="66" height="14" rx="2"/>`).join("") + "</g>",
    badge: '<g transform="translate(600 220)"><path d="M0 -90 L70 -60 L70 10 Q70 70 0 100 Q-70 70 -70 10 L-70 -60 Z" fill="rgba(255,255,255,.9)"/><path d="M0 -40 L12 -10 L44 -10 L18 10 L28 42 L0 22 L-28 42 L-18 10 L-44 -10 L-12 -10 Z" fill="#4d5d36"/></g>',
    phone: '<g transform="translate(600 230)"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="#fff"/><rect x="-56" y="-108" width="112" height="200" rx="10" fill="#4a3c8c" opacity=".2"/><circle cy="-20" r="34" fill="none" stroke="#4a3c8c" stroke-width="8"/><path d="M-18 -20 l12 12 l24 -26" fill="none" stroke="#4a3c8c" stroke-width="8" stroke-linecap="round"/></g>',
    shop: '<g transform="translate(600 260)"><rect x="-110" y="-40" width="220" height="150" fill="#fff"/><path d="M-125 -40 L-100 -100 L100 -100 L125 -40 Z" fill="#c8102e"/><g fill="#fff" opacity=".5"><rect x="-90" y="-100" width="30" height="60"/><rect x="-30" y="-100" width="30" height="60"/><rect x="30" y="-100" width="30" height="60"/></g><rect x="-30" y="30" width="60" height="80" fill="#c0782f"/></g>',
    box: '<g transform="translate(600 270)"><path d="M-100 -50 L0 -90 L100 -50 L100 70 L0 110 L-100 70 Z" fill="#f4dcb8"/><path d="M-100 -50 L0 -10 L100 -50 M0 -10 L0 110" stroke="#b98a52" stroke-width="5" fill="none"/></g>',
    briefcase: '<g transform="translate(600 260)"><rect x="-110" y="-60" width="220" height="150" rx="16" fill="#fff"/><path d="M-36 -60 v-24 a10 10 0 0 1 10 -10 h52 a10 10 0 0 1 10 10 v24" stroke="#fff" stroke-width="12" fill="none"/><rect x="-110" y="0" width="220" height="10" fill="#2d6aa3" opacity=".4"/></g>',
    tent: '<g transform="translate(600 300)"><path d="M-140 80 L0 -110 L140 80 Z" fill="#f4a259"/><path d="M-30 80 L0 10 L30 80 Z" fill="#7a3b1e"/><circle cx="-220" cy="-150" r="36" fill="#fff6d5"/></g>',
    health: '<g transform="translate(600 240)"><rect x="-90" y="-90" width="180" height="180" rx="36" fill="#fff"/><path d="M-22 -60 h44 v38 h38 v44 h-38 v38 h-44 v-38 h-38 v-44 h38 Z" fill="#c8102e"/></g>',
  };

  function sceneSVG(ex, i) {
    const id = "g" + i;
    // Generic skyline silhouette shared across scenes, tinted per scene.
    return `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ex.sky[0]}"/><stop offset="1" stop-color="${ex.sky[1]}"/></linearGradient></defs>
      <rect width="800" height="500" fill="url(#${id})"/>
      <g fill="rgba(0,0,0,.18)">
        <rect x="0" y="380" width="60" height="120"/><rect x="70" y="330" width="50" height="170"/>
        <rect x="130" y="300" width="70" height="200"/><path d="M215 500 V310 L265 280 L315 310 V500 Z"/>
        <rect x="330" y="350" width="40" height="150"/><rect x="380" y="260" width="55" height="240"/>
        <rect x="720" y="340" width="80" height="160"/>
      </g>
      ${MOTIFS[ex.motif] || ""}
    </svg>`;
  }

  const scenesEl = document.querySelector(".scenes");
  const input = document.getElementById("q");
  const caption = document.querySelector(".example-caption");
  let current = 0;
  let rotateTimer = null;

  if (scenesEl) {
    scenesEl.innerHTML = EXAMPLES.map(
      (ex, i) => `<div class="scene${i === 0 ? " active" : ""}">${sceneSVG(ex, i)}</div>`
    ).join("");
  }
  const scenes = scenesEl ? Array.from(scenesEl.children) : [];

  function showExample(i) {
    current = i;
    const ex = EXAMPLES[i];
    scenes.forEach((s, j) => s.classList.toggle("active", j === i));
    if (input) input.placeholder = `Try ‘${ex.q}’`;
    if (caption) caption.textContent = `Example ${i + 1} of ${EXAMPLES.length}: ${ex.caption}`;
  }

  function startRotation() {
    if (reduceMotion || rotateTimer) return;
    rotateTimer = setInterval(() => showExample((current + 1) % EXAMPLES.length), 4500);
  }
  function stopRotation() {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }

  if (input) {
    showExample(0);
    startRotation();
    input.addEventListener("focus", stopRotation);
    input.addEventListener("blur", () => { if (!input.value) startRotation(); });
  }

  // ---------- Answers ----------
  const form = document.querySelector(".search");
  const answerWrap = document.querySelector(".answer-wrap");

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function chipsHTML(excludeId) {
    return (
      '<div class="chips" aria-label="Other topics">' +
      window.SG_ANSWERS.filter((a) => a.id !== excludeId)
        .slice(0, 8)
        .map((a) => `<button type="button" class="chip" data-topic="${a.id}">${escapeHTML(a.title)}</button>`)
        .join("") +
      "</div>"
    );
  }

  function renderAnswer(entry) {
    answerWrap.innerHTML = `
      <article class="answer-card">
        <h2>${escapeHTML(entry.title)}</h2>
        <p>${escapeHTML(entry.summary)}</p>
        <ol>${entry.steps.map((s) => `<li>${escapeHTML(s)}</li>`).join("")}</ol>
        <a class="answer-source" href="${entry.sourceUrl}" target="_blank" rel="noopener">Go to ${escapeHTML(entry.sourceName)} ↗</a>
        <p class="answer-note">This is a general summary. Check the official source for current rules, fees and eligibility.</p>
      </article>
      <p style="margin:20px 0 0;color:var(--muted);font-size:14px">Other topics</p>
      ${chipsHTML(entry.id)}`;
  }

  function renderFallback(query) {
    answerWrap.innerHTML = `
      <article class="answer-card">
        <h2>We don’t have an answer for that yet</h2>
        <p>We couldn’t match “${escapeHTML(query)}” to one of our topics. Try different words, or start from these official sites:</p>
        <p><a class="answer-source" href="https://www.gov.sg/" target="_blank" rel="noopener">gov.sg ↗</a>
        &nbsp;&nbsp;<a class="answer-source" href="https://www.life.gov.sg/" target="_blank" rel="noopener">LifeSG ↗</a></p>
      </article>
      <p style="margin:20px 0 0;color:var(--muted);font-size:14px">Popular topics</p>
      ${chipsHTML(null)}`;
  }

  if (form && answerWrap) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let query = input.value.trim();
      // An empty submit answers the example currently shown, like the original.
      if (!query) {
        query = EXAMPLES[current].q;
        input.value = query;
      }
      stopRotation();
      const match = window.matchAnswer(query);
      match ? renderAnswer(match) : renderFallback(query);
    });

    answerWrap.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-topic]");
      if (!chip) return;
      const entry = window.SG_ANSWERS.find((a) => a.id === chip.dataset.topic);
      if (entry) {
        input.value = entry.title;
        renderAnswer(entry);
        answerWrap.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
  }

  document.querySelectorAll("[data-focus-search]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      input.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      input.focus({ preventScroll: true });
    })
  );

  // ---------- Menu drawer ----------
  const menuBtn = document.querySelector(".menu-btn");
  const drawer = document.getElementById("drawer");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    drawer.inert = !open;
    if (open) drawer.querySelector("a, button").focus();
    else menuBtn.focus();
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => setMenu(true));
    document.querySelectorAll("[data-close-menu]").forEach((el) => el.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
    });
  }

  // ---------- Agency sphere ----------
  const AGENCIES = [
    "ICA", "CPF Board", "HDB", "IRAS", "MOH", "MOE", "MOM", "LTA", "NParks", "NEA",
    "ACRA", "Singpass", "LifeSG", "MyCareersFuture", "SkillsFuture", "MINDEF", "SPF", "SCDF",
    "MSF", "PUB", "URA", "SLA", "CDC", "PA", "NLB", "HPB", "MAS", "EDB", "Enterprise SG",
    "STB", "SFA", "IMDA", "GovTech", "WSG", "ROM", "SSO",
  ];
  const sphere = document.querySelector(".sphere");
  if (sphere) {
    const n = AGENCIES.length;
    const radius = () => sphere.clientWidth * 0.4;
    const place = () => {
      const r = radius();
      sphere.innerHTML = AGENCIES.map((name, i) => {
        // Fibonacci sphere for an even spread of tiles.
        const y = 1 - (i / (n - 1)) * 2;
        const lat = Math.asin(y) * (180 / Math.PI);
        const lon = (i * 137.508) % 360;
        return `<span class="tile" style="transform: translate(-50%,-50%) rotateY(${lon}deg) rotateX(${lat}deg) translateZ(${r}px)">${name}</span>`;
      }).join("");
    };
    place();
    window.addEventListener("resize", place);
  }

  // ---------- Carousel ----------
  const carousel = document.querySelector(".carousel");
  document.querySelectorAll(".carousel-btns button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const step = carousel.querySelector(".preview").offsetWidth + 16;
      carousel.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" });
    })
  );

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
