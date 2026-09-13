/*
 * Chat with my résumé — v1
 *
 * Fully client-side, rule-based keyword matcher. No API calls, no server,
 * no per-message cost. Every answer is sourced directly from the dossier
 * this site is built from (my-cv-site-2/) — nothing here is invented, and
 * when nothing matches well enough, it says so instead of guessing.
 *
 * This is deliberately a v1: swapping in a real LLM later is a matter of
 * replacing answerQuery() with an API call — the widget markup and UI
 * don't need to change.
 */
(function () {
  var KB = [
    {
      keywords: ["who", "sheersh", "you", "yourself", "about"],
      answer: "Sheersh Kachhwaha is a Retail Advisory Analyst at Genpact, combining a renewable-energy engineering background with financial and investment decision-support — scenario modelling, sensitivity analysis, NPV and payback. He also writes independently on Substack about retail, CPG, and AI."
    },
    {
      keywords: ["genpact", "job", "role", "work", "current", "employer", "title"],
      answer: "He's currently an Analyst, Retail Advisory at Genpact (an advanced technology services and solutions company), based in London, since July 2026 — supporting structured, hypothesis-led analysis (MECE frameworks, issue trees) on cross-industry client advisory engagements."
    },
    {
      keywords: ["education", "degree", "university", "college", "study", "studied", "msc", "bsc", "kingston", "fergusson"],
      answer: "MSc in Renewable Energy Engineering from Kingston University (coursework Sep 2024–Nov 2025, conferred Nov 2025, convocation Mar 2026), and a BSc in Environmental Science from Fergusson College, Pune (2021–2024). His undergraduate thesis was a cost study of renewable energy resources."
    },
    {
      keywords: ["project", "projects", "portfolio", "work sample", "case study"],
      answer: "Three independent projects so far: an investment case comparing renewable vs. conventional energy systems (CapEx, OpEx, LCOE, carbon footprint, community impact), The Fair Energy Project — a wind farm proposal for Mablethorpe, Lincolnshire, and a procurement & materials cost analysis that recommended carbon steel over tool steel. See the Projects page for the full write-ups."
    },
    {
      keywords: ["skill", "skills", "tool", "tools", "python", "sql", "excel", "software", "language", "languages"],
      answer: "Core tools: Excel (advanced modelling), SQL, Python, Minitab, GaBi, and WindPro. Core methods: scenario/sensitivity modelling, NPV and payback analysis, MECE problem structuring, and ESG/lifecycle risk evaluation — increasingly paired with AI-augmented workflows. He's also fluent in English and Hindi, and currently learning Spanish."
    },
    {
      keywords: ["writing", "substack", "blog", "article", "articles", "write"],
      answer: "He writes on Substack (sheersh13.substack.com) about regulation, cost pressure, and AI reshaping retail and CPG — thirteen pieces so far, including \"Melting Margins. Rising Costs. No Place to Hide.\" and \"The Retailer of 2030 Sells Nothing You Can See.\" See the Writing page for all thirteen."
    },
    {
      keywords: ["contact", "email", "reach", "hire", "collaborate", "get in touch", "linkedin", "github"],
      answer: "Best route is email: Sheersh0802@gmail.com. He's also on LinkedIn (linkedin.com/in/sheersh-kachhwaha) and GitHub (github.com/sheersh-star) — see the Contact page for the direct links."
    },
    {
      keywords: ["hobby", "hobbies", "fun", "outside", "personal", "badminton", "nutrition", "fitness"],
      answer: "Badminton, an ongoing interest in learning new languages, and a deep, longstanding interest in nutrition, diet, fitness and sport — the last one traces back to watching his mother work as a nutritionist, and turns out to be directly useful in his CPG/retail work. See the About page for more."
    },
    {
      keywords: ["certification", "certifications", "certificate", "claude", "mckinsey"],
      answer: "Two confirmed so far: Claude 101 (Anthropic, Jul 2026) and the McKinsey Forward program (McKinsey.org, Jun 2026)."
    },
    {
      keywords: ["available", "availability", "open to work", "hiring", "freelance"],
      answer: "He's open to opportunities — the most reliable way to reach him is via the Contact page."
    },
    {
      keywords: ["reference", "references", "recommend", "recommendation"],
      answer: "Several willing references are listed by name and role on the About page, across Genpact, Beyond Barriers, Tradester, and his dissertation mentors — contact details are available on request."
    },
    {
      keywords: ["dissertation", "thesis", "research", "anova"],
      answer: "His MSc dissertation, \"StatInstrument: Statistical Monitoring of Instrumentation,\" used ANOVA-based statistical monitoring across wind, solar, and fuel-cell system instrumentation, supervised by Dr. Moupali Chakraborty."
    }
  ];

  var FALLBACK = "That's not in my dossier yet — rather than guess, I'll point you to Sheersh directly: Sheersh0802@gmail.com.";
  var GREETING = "Ask me about Sheersh's role, education, projects, skills, or writing — I only answer from what's actually documented on this site.";
  var SUGGESTIONS = ["What does he do at Genpact?", "What projects has he done?", "How do I contact him?"];

  function answerQuery(raw) {
    var q = raw.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var j = 0; j < KB[i].keywords.length; j++) {
        if (q.indexOf(KB[i].keywords[j]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    return best ? best.answer : FALLBACK;
  }

  function build() {
    var launcher = document.createElement("button");
    launcher.id = "chat-launcher";
    launcher.type = "button";
    launcher.textContent = "💬 Ask about me";

    var panel = document.createElement("div");
    panel.id = "chat-panel";
    panel.innerHTML =
      '<div id="chat-head"><span>Chat with my résumé</span><button type="button" id="chat-close" aria-label="Close">✕</button></div>' +
      '<div id="chat-log"></div>' +
      '<div id="chat-suggestions"></div>' +
      '<form id="chat-form"><input id="chat-input" type="text" placeholder="Ask something..." autocomplete="off" /><button type="submit">Send</button></form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var log = panel.querySelector("#chat-log");
    var form = panel.querySelector("#chat-form");
    var input = panel.querySelector("#chat-input");
    var suggestions = panel.querySelector("#chat-suggestions");

    function addMsg(text, who) {
      var div = document.createElement("div");
      div.className = "chat-msg " + who;
      div.textContent = text;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function ask(text) {
      addMsg(text, "user");
      window.setTimeout(function () { addMsg(answerQuery(text), "bot"); }, 200);
    }

    SUGGESTIONS.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", function () { ask(s); });
      suggestions.appendChild(b);
    });

    launcher.addEventListener("click", function () {
      panel.classList.toggle("open");
      if (panel.classList.contains("open") && log.children.length === 0) {
        addMsg(GREETING, "bot");
      }
    });
    panel.querySelector("#chat-close").addEventListener("click", function () {
      panel.classList.remove("open");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      ask(v);
      input.value = "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
