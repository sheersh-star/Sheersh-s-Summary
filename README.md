# site/ — Stage 2 output: the actual website

Generated from the Stage 1 dossier in the folders above (`01_identity/` through `15_legal/`), per `16_prompt.md` and the decisions logged in `TODO.md` on 2026-09-12. Zero-dependency static HTML/CSS/JS — no build step, no framework, no server required to preview.

## Preview it

```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080
```

Or just double-click `index.html` — everything works from the local filesystem too, except the chat widget's suggestion buttons render identically either way.

## Pages

- `index.html` — Home
- `about.html` — About
- `experience.html` — Experience
- `projects.html` — Projects
- `writing.html` — Writing
- `contact.html` — Contact

Shared assets: `styles.css` (all design tokens + components), `theme.js` (light/dark toggle), `chat-widget.js` (the "chat with my résumé" feature — see below).

## Honesty markers

Anything shown with a dashed amber-left-border box and italic text is a **known gap**, not filler — it names exactly what's missing and where it needs to come from (usually you, sometimes a decision). These aren't meant to stay forever; as `TODO.md` items get resolved, delete the corresponding `.pending` block and add the real content.

## The chat widget

`chat-widget.js` is a fully client-side, rule-based keyword matcher — no API key, no server, no per-message cost. It only answers from facts hardcoded into its own knowledge base (`KB` array), each one traceable back to a specific dossier file. If nothing matches, it says so and points to your email rather than guessing. This was a deliberate choice to ship the "play around with it" feature now, for free, rather than wait on a hosting/API budget decision — swapping in a real LLM later means replacing `answerQuery()` with an API call; the widget UI doesn't need to change.

## What this build deliberately does NOT include yet

These all trace to open items in `TODO.md` / `14_technical/technical_requirements.md`:
- A real contact form (needs a hosting/backend decision)
- A theme/CMS for editing content without touching HTML (needs an editability decision)
- Analytics
- A privacy policy (only needed once there's a form collecting data)
- Headshots/photos (asset folders are still empty)
- A domain — this currently only runs locally or wherever you point static hosting at it

None of these block using the site as-is; they block making it feel "finished" in the way a launched personal site usually does.
