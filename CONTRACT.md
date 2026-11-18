# Build contract (shared by all agents)

Site: "Carbon and its Compounds" — NCERT Class 10 Science, Chapter 4 — interactive learning site for kids (~14–15 yrs, Indian CBSE students; many have English as a second language).
Plain static site (HTML + CSS + vanilla JS, NO build step, NO external JS libraries, NO CDN). Hosted on GitHub Pages from repo root.

## Files and owners

| File | Owner |
|---|---|
| `content/chapter_extract.md` | Agent 1 (textbook extractor) — faithful structured extract of the NCERT chapter |
| `js/content.js` | Agent 2 (concept writer) |
| `js/animations/<id>.js` (one file per concept) | Agent 3 (animator) |
| `index.html`, `css/style.css`, `js/app.js` | Main orchestrator (shell) |

## Page design (per concept, in order)
1. **Explain** — simple-language explanation (from `content.js`)
2. **Play** — interactive animation (from `js/animations/<id>.js`) mounted into a container
3. **Check yourself** — 2 short multiple-choice questions (from `content.js`)

## Concept IDs (fixed — use exactly these)

| # | id | Topic |
|---|---|---|
| 1 | `carbon-everywhere` | Carbon around us; covalent compounds are poor conductors, low melting/boiling points |
| 2 | `covalent-bond` | Why carbon shares electrons (can't easily gain 4 / lose 4); electron-dot structures; single/double/triple bonds (H2, O2, N2, CH4) |
| 3 | `allotropes` | Diamond, graphite, fullerene (C-60) |
| 4 | `versatile-carbon` | Catenation and tetravalency |
| 5 | `saturated-unsaturated` | Saturated (single bonds) vs unsaturated (double/triple) hydrocarbons; alkanes, alkenes, alkynes |
| 6 | `chains-rings` | Straight chains, branched chains, rings (cyclohexane, benzene); structural isomers (butane / isobutane) |
| 7 | `functional-groups` | Heteroatoms and functional groups: –Cl/–Br, –OH, –CHO, >C=O, –COOH |
| 8 | `homologous-series` | Homologous series, –CH2– difference, trends in properties |
| 9 | `nomenclature` | Naming carbon compounds (prefix by carbons + suffix by functional group) |
| 10 | `combustion` | Combustion; clean blue flame vs sooty yellow flame |
| 11 | `oxidation` | Oxidation with alkaline KMnO4 / acidified K2Cr2O7 (ethanol → ethanoic acid); oxidising agents |
| 12 | `addition` | Addition reaction: hydrogenation with Ni/Pd catalyst; vegetable oil → vanaspati; saturated vs unsaturated fats |
| 13 | `substitution` | Substitution: methane + chlorine in sunlight |
| 14 | `ethanol` | Ethanol: properties, reaction with sodium, dehydration with hot conc. H2SO4 |
| 15 | `ethanoic-acid` | Ethanoic acid: glacial acetic acid, vinegar, esterification, saponification, reaction with base and carbonates |
| 16 | `soaps-detergents` | Soaps and detergents: micelles, cleaning action, hard water and scum |

## `js/content.js` format (Agent 2)

```js
window.CHAPTER = { title: "...", subtitle: "...", intro: "<p>...</p>" };
window.CONCEPTS = [
  {
    id: "covalent-bond",            // from table above
    title: "Sharing is Caring: The Covalent Bond",
    emoji: "🤝",
    tagline: "one-line hook",
    explain: "<p>...</p><p>...</p>",  // HTML string; short paragraphs, may use <b>, <ul>, <sub>, simple analogy
    keyPoints: ["...", "..."],        // 3–5 bullet takeaways
    playHint: "What to do in the animation, one sentence (Agent 2 writes after reading Agent 3's animation, or keep generic)",
    textbookRef: "Section 4.1",
    quiz: [ { q: "...", options: ["a","b","c","d"], answer: 1, why: "..." } ]   // 2 questions, answer = index
  }
];
```

## `js/animations/<id>.js` format (Agent 3)

```js
(window.ANIMATIONS = window.ANIMATIONS || {})["covalent-bond"] = function mount(el) {
  // el = an empty <div class="anim-stage"> (width ~100% of content column, up to ~760px; height auto — you set it)
  // build DOM/SVG/canvas inside el; must work with mouse AND touch; must be responsive down to 340px width
  // return optional cleanup function
};
```

Styling for animations: use CSS variables defined in `css/style.css` — `--bg`, `--card`, `--ink`, `--muted`, `--accent`, `--accent-2`, `--good`, `--bad`, `--carbon` (dark grey atom), `--hydrogen` (white/light), `--oxygen` (red), `--chlorine` (green), `--nitrogen` (blue), `--line`. Put animation-specific CSS inside the JS (inject a `<style>` once, class names prefixed with the concept id) so files are self-contained.
