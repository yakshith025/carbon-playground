/* Nomenclature: build names from carbon count + functional group; quiz mode */
(function () {
  "use strict";
  var ID = "nomenclature";
  /* ---- shared mini-kit (inlined so every file is self-contained) ---- */
  var NS = "http://www.w3.org/2000/svg";
  function S(t, a, p) { var e = document.createElementNS(NS, t); if (a) for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function H(t, c, p, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; if (p) p.appendChild(e); return e; }
  function C(n) { return n.split(" ").map(function (x) { return ID + "-" + x; }).join(" "); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function pt(svg, ev) { var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; p = p.matrixTransform(m.inverse()); return { x: p.x, y: p.y }; }
  var BASE = ".P-wrap{color:var(--ink);background:var(--card);border-radius:18px;padding:12px;box-sizing:border-box;width:100%;max-width:760px;margin:0 auto;font-size:15px;line-height:1.45;-webkit-user-select:none;user-select:none}.P-wrap *{box-sizing:border-box}.P-instr{font-weight:700;margin:0 0 10px;padding:6px 12px;border-radius:12px;background:var(--bg);display:inline-block}.P-stage{position:relative;width:100%}.P-stage svg{display:block;width:100%;height:auto;touch-action:none;overflow:visible}.P-cap{min-height:3em;margin-top:10px;padding:10px 14px;border-radius:14px;background:var(--bg);border-left:6px solid var(--accent);transition:border-color .3s}.P-cap.P-good{border-left-color:var(--good)}.P-cap.P-bad{border-left-color:var(--bad)}.P-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}.P-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;align-items:center}.P-btn{appearance:none;-webkit-appearance:none;border:2px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;touch-action:manipulation;transition:transform .15s,background .2s,color .2s,border-color .2s}.P-btn:hover{border-color:var(--accent)}.P-btn:active{transform:scale(.95)}.P-btn.P-on{background:var(--accent);border-color:var(--accent);color:#fff}.P-btn:disabled{opacity:.45;cursor:default}.P-reset{margin-left:auto;background:var(--bg)}@keyframes P-pop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}.P-popin{animation:P-pop .4s ease-out both;transform-box:fill-box;transform-origin:center}.P-info{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;margin:6px 0 2px}.P-big{font-size:20px;font-weight:800}.P-tag{display:inline-block;padding:2px 10px;border-radius:999px;background:var(--bg);border:1px solid var(--line);font-size:13px;font-weight:700}input[type=range].P-range{width:100%;accent-color:var(--accent);height:28px;touch-action:pan-y}@media (max-width:420px){.P-wrap{padding:8px;font-size:14px}.P-btn{padding:6px 10px;font-size:13px}.P-big{font-size:17px}}";
  function injectCSS(extra) { if (document.getElementById(ID + "-css")) return; var s = document.createElement("style"); s.id = ID + "-css"; s.textContent = (BASE + (extra || "")).replace(/P-/g, ID + "-"); document.head.appendChild(s); }
  function shell(el, instr) {
    clear(el);
    var w = H("div", C("wrap"), el), ins = H("div", C("instr"), w, instr), st = H("div", C("stage"), w), cap = H("div", C("cap"), w), bar = H("div", C("btns"), w);
    cap.setAttribute("aria-live", "polite");
    return { wrap: w, instr: ins, stage: st, cap: cap, bar: bar, say: function (h, tone) { cap.innerHTML = h; cap.className = C("cap") + (tone ? " " + C(tone) : ""); } };
  }
  function btn(p, label, fn, cls) { var b = H("button", C("btn" + (cls ? " " + cls : "")), p, label); b.type = "button"; b.addEventListener("click", fn); return b; }
  function onOnly(list, b) { list.forEach(function (x) { x.classList.toggle(ID + "-on", x === b); }); }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  /* tweens that stop when the mount is cleaned up or reset (gen changes) */
  function Anim() {
    var o = { alive: true, gen: 0, timers: [] };
    o.tween = function (ms, fn, done) { var g = o.gen, t0 = performance.now(); function f(now) { if (!o.alive || g !== o.gen) return; var t = Math.min(1, (now - t0) / ms); fn(ease(t), t); if (t < 1) requestAnimationFrame(f); else if (done) done(); } requestAnimationFrame(f); };
    o.later = function (ms, fn) { var g = o.gen; var id = setTimeout(function () { if (o.alive && g === o.gen) fn(); }, ms); o.timers.push(id); };
    o.reset = function () { o.gen++; o.timers.forEach(clearTimeout); o.timers = []; };
    o.stop = function () { o.alive = false; o.reset(); };
    return o;
  }
  /* ---- atoms & molecules ---- */
  var COL = { C: ["var(--carbon)", "#fff"], H: ["var(--hydrogen)", "var(--ink)"], O: ["var(--oxygen)", "#fff"], N: ["var(--nitrogen)", "#fff"], Cl: ["var(--chlorine)", "#fff"], Br: ["#a0522d", "#fff"], Na: ["#9aa3ad", "#fff"], R: ["var(--accent-2)", "#fff"] };
  function atomG(p, x, y, el, r, cls) {
    var g = S("g", { transform: "translate(" + x + "," + y + ")" }, p);
    var i = S("g", cls ? { class: cls } : null, g);
    var c = COL[el] || COL.C;
    S("circle", { r: r, fill: c[0], stroke: "var(--ink)", "stroke-opacity": 0.35, "stroke-width": 1.5 }, i);
    S("circle", { r: r * 0.32, cx: -r * 0.35, cy: -r * 0.38, fill: "#fff", opacity: 0.35 }, i);
    var t = S("text", { "text-anchor": "middle", dy: "0.36em", "font-size": (el.length > 1 ? r * 0.85 : r * 1.05), "font-weight": 700, fill: c[1], "pointer-events": "none" }, i);
    t.textContent = el;
    g.inner = i;
    return g;
  }
  var VAL = { C: 4, H: 1, O: 2, N: 3, Cl: 1, Br: 1, R: 1 };
  function angDist(a, b) { return Math.abs(((a - b) % 360 + 540) % 360 - 180); }
  /* add H atoms to every free valency, pointing away from existing bonds */
  function fillH(atoms, bonds, len) {
    var out = [];
    atoms.forEach(function (a, i) {
      if (a.noH || a.el === "H") return;
      var used = 0, dirs = [];
      bonds.forEach(function (b) { if (b[0] === i || b[1] === i) { used += b[2]; var o = atoms[b[0] === i ? b[1] : b[0]]; dirs.push(Math.atan2(o.y - a.y, o.x - a.x) * 180 / Math.PI); } });
      var f = (VAL[a.el] || 0) - used, picks = [];
      function score(c, extra) { var m = 999; dirs.concat(extra).forEach(function (d) { var x = angDist(c, d); if (x < m) m = x; }); return m; }
      if (f === 2 && dirs.length) {
        var best = -1, bp = [0, 180];
        for (var p = 0; p < 360; p += 10) for (var q = p + 10; q < 360; q += 10) { var s = Math.min(score(p, []), score(q, []), angDist(p, q)); if (s > best + 0.01) { best = s; bp = [p, q]; } }
        picks = bp;
      } else {
        for (var k = 0; k < f; k++) { var bb = -1, bc = 0; for (var c = 0; c < 360; c += 15) { var s2 = score(c, picks); if (s2 > bb + 0.01) { bb = s2; bc = c; } } picks.push(bc); }
      }
      picks.forEach(function (d, k) { out.push({ el: "H", x: a.x + len * Math.cos(d * Math.PI / 180), y: a.y + len * Math.sin(d * Math.PI / 180), p: i, k: k, ang: d }); });
    });
    return out;
  }
  function bondLines(g, a, b, n, col, w) {
    var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, px = -dy / L * 6, py = dx / L * 6;
    for (var i = 0; i < n; i++) { var o = i - (n - 1) / 2; S("line", { x1: a.x + px * o, y1: a.y + py * o, x2: b.x + px * o, y2: b.y + py * o, stroke: col || "var(--ink)", "stroke-width": w || 3, "stroke-linecap": "round" }, g); }
  }
  /* atoms: [{el,x,y,cls?,noH?}], bonds: [[i,j,order]] ; returns the added H list */
  function drawMol(g, atoms, bonds, o) {
    o = o || {}; var r = o.r || 16, hl = o.hlen || 34;
    var hs = o.noFill ? [] : fillH(atoms, bonds, hl);
    if (o.subs) hs.forEach(function (h) { var s = o.subs[h.p + ":" + h.k]; if (s) { h.el = s; h.x = atoms[h.p].x + (h.x - atoms[h.p].x) * 1.25; h.y = atoms[h.p].y + (h.y - atoms[h.p].y) * 1.25; } });
    var gb = S("g", null, g), ga = S("g", null, g);
    bonds.forEach(function (b) { bondLines(gb, atoms[b[0]], atoms[b[1]], b[2]); });
    hs.forEach(function (h) { bondLines(gb, atoms[h.p], h, 1); });
    atoms.forEach(function (a) { a.g = atomG(ga, a.x, a.y, a.el, a.el === "H" ? r * 0.7 : r, a.cls); });
    hs.forEach(function (h) { h.g = atomG(ga, h.x, h.y, h.el, h.el === "H" ? r * 0.7 : r, h.cls || atoms[h.p].hcls); });
    return hs;
  }
  function formula(list) {
    var c = {}; list.forEach(function (a) { if (a.el !== "R") c[a.el] = (c[a.el] || 0) + 1; });
    var ord = { C: 0, H: 1 };
    return Object.keys(c).sort(function (a, b) { return ((a in ord ? ord[a] : 2) - (b in ord ? ord[b] : 2)) || (a < b ? -1 : 1); })
      .map(function (k) { return k + (c[k] > 1 ? "<sub>" + c[k] + "</sub>" : ""); }).join("");
  }
  function sub(s) { return s.replace(/(\d+)/g, "<sub>$1</sub>"); }
  /* fit an svg viewBox around content with padding */
  function fitView(svg, g, pad, minW, minH) {
    try { var b = g.getBBox(); var w = Math.max(minW || 0, b.width + 2 * pad), h = Math.max(minH || 0, b.height + 2 * pad); var cx = b.x + b.width / 2, cy = b.y + b.height / 2; svg.setAttribute("viewBox", (cx - w / 2) + " " + (cy - h / 2) + " " + w + " " + h); } catch (e) { }
  }

  var EXTRA = ".P-name{font-size:26px;font-weight:800;letter-spacing:.01em;margin:4px 0;min-height:1.3em}.P-name span{transition:color .3s}" +
    ".P-pre{color:var(--chlorine)}.P-stem{color:var(--accent)}.P-end{color:var(--accent-2)}" +
    ".P-rule{font-size:13px;color:var(--muted)}.P-lbl{font-size:13px;font-weight:700;color:var(--muted);min-width:64px}" +
    ".P-score{font-weight:800;margin-left:auto}.P-numC{font-size:11px;font-weight:800;fill:var(--accent)}" +
    "@media (max-width:420px){.P-name{font-size:21px}}";
  var STEMS = ["meth", "eth", "prop", "but", "pent"];
  var GROUPS = [
    { k: "ane", chip: "only C–H", min: 1, pre: "", end: "ane", rule: "no group → ending <b>-ane</b>" },
    { k: "ene", chip: "C=C", min: 2, pre: "", end: "ene", rule: "double bond → <b>-ene</b>" },
    { k: "yne", chip: "C≡C", min: 2, pre: "", end: "yne", rule: "triple bond → <b>-yne</b>" },
    { k: "chloro", chip: "–Cl", min: 1, pre: "chloro", end: "ane", rule: "–Cl → prefix <b>chloro-</b>" },
    { k: "bromo", chip: "–Br", min: 1, pre: "bromo", end: "ane", rule: "–Br → prefix <b>bromo-</b>" },
    { k: "ol", chip: "–OH", min: 1, pre: "", end: "anol", rule: "–OH (alcohol) → <b>-ol</b>: drop the 'e', add 'ol'" },
    { k: "al", chip: "–CHO", min: 1, pre: "", end: "anal", rule: "–CHO (aldehyde) → <b>-al</b>" },
    { k: "one", chip: ">C=O", min: 3, pre: "", end: "anone", rule: ">C=O (ketone) → <b>-one</b>" },
    { k: "oic", chip: "–COOH", min: 1, pre: "", end: "anoic acid", rule: "–COOH (acid) → <b>-oic acid</b>" }
  ];
  var ENDS = ["ane", "ene", "yne", "anol", "anal", "anone", "anoic acid"], FRONTS = ["", "chloro", "bromo"];
  function gk(k) { return GROUPS.filter(function (g) { return g.k === k; })[0]; }
  function build(n, k) {
    var D = 66, atoms = [], bonds = [], L = (n - 1) * D;
    for (var i = 0; i < n; i++) { atoms.push({ el: "C", x: i * D, y: 0 }); if (i) bonds.push([i - 1, i, 1]); }
    if (k === "ene") bonds[0][2] = 2;
    if (k === "yne") bonds[0][2] = 3;
    if (k === "chloro" || k === "bromo") { atoms.push({ el: k === "chloro" ? "Cl" : "Br", x: L + 72, y: 0 }); bonds.push([n - 1, n, 1]); }
    if (k === "ol") { atoms.push({ el: "O", x: L + 62, y: 0 }); bonds.push([n - 1, n, 1]); }
    if (k === "al" || k === "oic") { atoms.push({ el: "O", x: L, y: -60 }); bonds.push([n - 1, n, 2]); }
    if (k === "oic") { atoms.push({ el: "O", x: L + 62, y: 0 }); bonds.push([n - 1, n + 1, 1]); }
    if (k === "one") { atoms.push({ el: "O", x: D, y: -60 }); bonds.push([1, n, 2]); }
    return { atoms: atoms, bonds: bonds };
  }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "");
    var modes = H("div", C("row"), ui.stage), mb = [];
    mb.push(btn(modes, "🛠️ Build a name", function () { builder(); }));
    mb.push(btn(modes, "🎯 Name quiz", function () { quiz(); }));
    var svg = S("svg", { viewBox: "0 0 300 150", role: "img", "aria-label": "Molecule to name" }, ui.stage), gM = S("g", null, svg);
    var nameEl = H("div", C("name"), ui.stage), ruleEl = H("div", C("rule"), ui.stage), panel = H("div", null, ui.stage);
    panel.style.marginTop = "10px";
    var n = 3, k = "ane", score = 0, tries = 0, Q = null, pick = { f: "", s: "", e: "" };

    function showMol(n2, k2) {
      clear(gM);
      var m = build(n2, k2);
      var hs = drawMol(gM, m.atoms, m.bonds, { r: 15, hlen: 30 });
      m.atoms.forEach(function (a, i) { if (a.el === "C") { var t = S("text", { x: a.x + 13, y: a.y + 24, class: C("numC") }, gM); t.textContent = i + 1; } });
      fitView(svg, gM, 24, 260, 140);
      return hs;
    }
    function nameHTML(pre, stem, end) { return (pre ? "<span class='" + C("pre") + "'>" + pre + "</span>" : "") + "<span class='" + C("stem") + "'>" + stem + "</span><span class='" + C("end") + "'>" + end + "</span>"; }

    /* -------- builder -------- */
    var nb, kb;
    function builder() {
      onOnly(mb, mb[0]); clear(panel);
      ui.instr.innerHTML = "👆 Choose how many carbons and which group, and watch the name build itself.";
      var r1 = H("div", C("row"), panel); H("span", C("lbl"), r1, "Carbons");
      nb = STEMS.map(function (s, i) { return btn(r1, (i + 1) + " · " + s, function () { n = i + 1; if (n < gk(k).min) k = "ane"; upd(); }); });
      var r2 = H("div", C("row"), panel); H("span", C("lbl"), r2, "Group");
      kb = GROUPS.map(function (g) { var b = btn(r2, g.chip, function () { if (n < g.min) { ui.say("A " + g.chip + " group needs at least <b>" + g.min + " carbons</b>. Add more carbons first!", "bad"); return; } k = g.k; upd(); }); b.dataset.k = g.k; return b; });
      upd();
    }
    function upd() {
      var g = gk(k);
      onOnly(nb, nb[n - 1]); onOnly(kb, kb.filter(function (b) { return b.dataset.k === k; })[0]);
      kb.forEach(function (b) { b.style.opacity = n < gk(b.dataset.k).min ? 0.45 : 1; });
      showMol(n, k);
      nameEl.innerHTML = nameHTML(g.pre, STEMS[n - 1], g.end);
      ruleEl.innerHTML = "<b>" + n + "</b> carbon" + (n > 1 ? "s" : "") + " → <b>" + STEMS[n - 1] + "</b> &nbsp;+&nbsp; " + g.rule;
      ui.say("Step 1: count the carbons in the chain (" + n + " → <b>" + STEMS[n - 1] + "</b>). Step 2: add the prefix or suffix for the functional group. Result: <b>" + g.pre + STEMS[n - 1] + g.end + "</b>.", "good");
    }

    /* -------- quiz -------- */
    var fb, sbn, eb, scoreEl;
    function quiz() {
      onOnly(mb, mb[1]); clear(panel); score = 0; tries = 0;
      ui.instr.innerHTML = "🎯 Look at the molecule, then tap the pieces that make its name.";
      var r0 = H("div", C("row"), panel); H("span", C("lbl"), r0, "Prefix"); fb = FRONTS.map(function (f) { var b = btn(r0, f || "(none)", function () { pick.f = f; pick.ft = true; show(); }); b.dataset.v = f; return b; });
      var r1 = H("div", C("row"), panel); H("span", C("lbl"), r1, "Carbons"); sbn = STEMS.map(function (s) { var b = btn(r1, s, function () { pick.s = s; show(); }); b.dataset.v = s; return b; });
      var r2 = H("div", C("row"), panel); H("span", C("lbl"), r2, "Ending (suffix)"); eb = ENDS.map(function (e) { var b = btn(r2, "-" + e, function () { pick.e = e; show(); }); b.dataset.v = e; return b; });
      var r3 = H("div", C("row"), panel);
      btn(r3, "✅ Check", check); btn(r3, "⏭️ Next", next);
      scoreEl = H("span", C("score"), r3, "");
      next();
    }
    function next() {
      var c, prev = Q;
      do { var g = GROUPS[Math.floor(Math.random() * GROUPS.length)], nn = 1 + Math.floor(Math.random() * 5); c = { g: g, n: nn }; } while (c.n < c.g.min || (prev && prev.g === c.g && prev.n === c.n));
      Q = c; Q.done = false; pick = { f: "", s: "", e: "" };
      showMol(Q.n, Q.g.k); show();
      ruleEl.innerHTML = "Hint: count the numbered carbons, then look for O, Cl, Br or extra bonds.";
      ui.say("What is the name of this molecule? Build it from the pieces below, then tap <b>Check</b>.");
      scoreEl.textContent = "Score: " + score + " / " + tries;
    }
    function show() {
      [[fb, pick.f], [sbn, pick.s], [eb, pick.e]].forEach(function (p) { onOnly(p[0], p[0].filter(function (b) { return b.dataset.v === p[1] && (p[1] !== "" || pick.ft); })[0]); });
      nameEl.innerHTML = pick.s || pick.e || pick.f ? nameHTML(pick.f, pick.s || "___", pick.e || "___") : "<span style='color:var(--muted)'>? ? ?</span>";
    }
    function check() {
      if (!pick.s || !pick.e) { ui.say("Pick a <b>carbon</b> piece and an <b>ending</b> first.", "bad"); return; }
      var right = pick.f === Q.g.pre && pick.s === STEMS[Q.n - 1] && pick.e === Q.g.end, ans = Q.g.pre + STEMS[Q.n - 1] + Q.g.end;
      if (!Q.done) { tries++; if (right) score++; Q.done = true; }
      scoreEl.textContent = "Score: " + score + " / " + tries;
      if (right) ui.say("🎉 Correct! It is <b>" + ans + "</b>. " + Q.n + " carbon" + (Q.n > 1 ? "s" : "") + " → " + STEMS[Q.n - 1] + ", and " + Q.g.rule.replace(/<[^>]+>/g, "") + ". Tap Next.", "good");
      else ui.say("Not quite. Count the carbons again (" + Q.n + " → " + STEMS[Q.n - 1] + ") and check the group: " + Q.g.rule + ". The answer is <b>" + ans + "</b>.", "bad");
    }

    btn(ui.bar, "↺ Reset", function () { n = 3; k = "ane"; builder(); }, "reset");
    builder();
    return function () { clear(el); };
  };
})();
