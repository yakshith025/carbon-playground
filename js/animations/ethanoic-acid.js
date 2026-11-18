/* Ethanoic acid: glacial acid freezing, acid tests, esterification, carbonate + lime water */
(function () {
  "use strict";
  var ID = "ethanoic-acid";
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

  var EXTRA = ".P-eq{font-weight:700;padding:8px 12px;border-radius:12px;border:2px dashed var(--line);margin-top:8px;font-size:14px;text-align:center}" +
    ".P-fill{transition:fill 1s ease,opacity .8s}.P-strip{transition:fill 1.2s ease,transform .6s ease}.P-smell{animation:P-rise 2.6s ease-out forwards}@keyframes P-rise{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(14px,-90px)}}" +
    ".P-ice{transition:opacity .6s}";
  function tubePath(x, top, bot, w) { return "M" + (x - w) + "," + top + " V" + bot + " A" + w + "," + w + " 0 0 0 " + (x + w) + "," + bot + " V" + top; }
  function tube(svg, x, top, bot, w, liqTop, col, label) {
    var id = ID + "-c" + Math.random().toString(36).slice(2, 7);
    S("path", { d: tubePath(x, top - 50, bot, w) + " Z" }, S("clipPath", { id: id }, S("defs", null, svg)));
    var l = S("rect", { x: x - w - 2, y: liqTop, width: 2 * w + 4, height: bot - liqTop + w + 2, fill: col, class: C("fill"), "clip-path": "url(#" + id + ")" }, svg);
    S("path", { d: tubePath(x, top, bot, w), fill: "none", stroke: "var(--ink)", "stroke-width": 2.5, "stroke-opacity": .6 }, svg);
    if (label) { var t = S("text", { x: x, y: bot + w + 18, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--muted)" }, svg); t.textContent = label; }
    return l;
  }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "");
    var tabs = H("div", C("row"), ui.stage), tb = [];
    [["❄️ Glacial acid", glacial], ["🧪 Acid test", acidTest], ["🌸 Make an ester", ester], ["🫧 + Carbonate", carbonate]].forEach(function (t, i) { tb.push(btn(tabs, t[0], function () { open(i); })); });
    var pane = H("div", null, ui.stage), eq = H("div", C("eq"), ui.stage);
    var raf = 0, alive = true, loopFn = null, cur = 0;
    function loop() { if (!alive) return; if (loopFn) loopFn(); raf = requestAnimationFrame(loop); }
    function open(i) { cur = i; A.reset(); loopFn = null; onOnly(tb, tb[i]); clear(pane); [glacial, acidTest, ester, carbonate][i](); }
    function row() { var r = H("div", C("row"), pane); r.style.marginTop = "8px"; return r; }
    function bub(g, list, x, w, yb, yt, rate, out) {
      if (Math.random() < rate) list.push({ x: x + (Math.random() - .5) * w, y: yb, r: 2 + Math.random() * 3 });
      return list.filter(function (b) {
        b.y -= 1.2 + b.r * .3; if (!b.e) b.e = S("circle", { r: b.r, fill: "#fff", stroke: "var(--muted)", "stroke-width": 1 }, g);
        if (b.y < yt) { b.e.parentNode.removeChild(b.e); if (out) out(); return false; }
        b.e.setAttribute("cx", b.x + Math.sin(b.y / 6) * 1.5); b.e.setAttribute("cy", b.y); return true;
      });
    }

    /* 1. glacial acetic acid */
    function glacial() {
      ui.instr.innerHTML = "🎚️ Slide the temperature down and watch the pure ethanoic acid.";
      var svg = S("svg", { viewBox: "0 0 400 230", role: "img", "aria-label": "Beaker of pure ethanoic acid" }, pane);
      S("path", { d: "M120,40 V200 Q120,214 134,214 H266 Q280,214 280,200 V40", fill: "none", stroke: "var(--muted)", "stroke-width": 3 }, svg);
      var liq = S("rect", { x: 122, y: 90, width: 156, height: 122, rx: 10, class: C("fill"), fill: "#eef7ff" }, svg);
      var ice = S("g", { class: C("ice"), opacity: 0 }, svg);
      S("rect", { x: 122, y: 90, width: 156, height: 122, rx: 10, fill: "#dff0ff" }, ice);
      [[150, 120], [200, 110], [245, 128], [170, 165], [225, 175], [140, 195], [262, 190], [200, 145]].forEach(function (p) {
        S("path", { d: "M" + p[0] + "," + (p[1] - 14) + " l12,7 v14 l-12,7 l-12,-7 v-14 z", fill: "#fff", stroke: "#9cc9ef", "stroke-width": 2 }, ice);
      });
      var lab = S("text", { x: 200, y: 30, "text-anchor": "middle", "font-size": 14, "font-weight": 800, fill: "var(--ink)" }, svg);
      S("rect", { x: 316, y: 40, width: 14, height: 160, rx: 7, fill: "var(--card)", stroke: "var(--muted)", "stroke-width": 2 }, svg);
      S("circle", { cx: 323, cy: 206, r: 11, fill: "var(--bad)" }, svg);
      var merc = S("rect", { x: 320, y: 100, width: 8, height: 100, rx: 4, fill: "var(--bad)" }, svg);
      var mpY = 195 - 16.6 / 30 * 150;
      S("line", { x1: 308, x2: 338, y1: mpY, y2: mpY, stroke: "var(--nitrogen)", "stroke-dasharray": "3 2", "stroke-width": 2 }, svg);
      var mpl = S("text", { x: 342, y: mpY + 4, "font-size": 10, "font-weight": 700, fill: "var(--nitrogen)" }, svg); mpl.textContent = "16.6 °C (290 K)";
      var tt = S("text", { x: 323, y: 30, "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: "var(--ink)" }, svg);
      var rg = H("input", C("range"), pane); rg.type = "range"; rg.min = 0; rg.max = 30; rg.step = 0.5; rg.value = 25; rg.setAttribute("aria-label", "Temperature");
      var st = -1;
      function upd() {
        var T = +rg.value, y = 195 - T / 30 * 150; merc.setAttribute("y", y); merc.setAttribute("height", 202 - y);
        tt.textContent = T + " °C"; var solid = T < 16.6;
        ice.setAttribute("opacity", solid ? 1 : 0); lab.textContent = solid ? "❄️ solid: frozen like a glacier" : "💧 liquid";
        if (+solid !== st) { st = +solid; ui.say(solid ? "❄️ Below <b>16.6 °C (290 K)</b> pure ethanoic acid <b>freezes</b> into icy crystals. In cold places it freezes in winter, so it is called <b>glacial acetic acid</b>." : "Pure ethanoic acid is a liquid at room temperature. Slide the temperature down to below its melting point...", solid ? "good" : null); }
      }
      rg.addEventListener("input", upd); upd();
      eq.innerHTML = "Vinegar = 5–8% ethanoic acid in water, used to preserve pickles. Pure acid melts at 290 K.";
    }

    /* 2. litmus & universal indicator */
    function acidTest() {
      ui.instr.innerHTML = "👆 Test both acids: dip blue litmus, then add universal indicator.";
      var svg = S("svg", { viewBox: "0 0 400 284", role: "img", "aria-label": "Two acids being tested" }, pane);
      var a = tube(svg, 120, 40, 180, 28, 90, "#f2f8ff", "dilute ethanoic acid"), b = tube(svg, 280, 40, 180, 28, 90, "#f2f8ff", "dilute HCl");
      var strips = [120, 280].map(function (x) { var s = S("rect", { x: x - 6, y: 0, width: 12, height: 70, rx: 3, fill: "#64a0ff", class: C("strip") }, svg); return s; });
      var phs = [120, 280].map(function (x) { var t = S("text", { x: x + 34, y: 150, "text-anchor": "start", "font-size": 13, "font-weight": 800, fill: "var(--ink)" }, svg); return t; });
      // pH scale
      var cols = ["#d50000", "#ff1744", "#ff6d00", "#ffab00", "#ffd600", "#c6ff00", "#64dd17", "#00c853", "#00bfa5", "#00b8d4", "#2979ff", "#3d5afe", "#651fff", "#6200ea"];
      cols.forEach(function (c, i) { S("rect", { x: 60 + i * 20, y: 258, width: 20, height: 12, fill: c }, svg); });
      var sl = S("text", { x: 60, y: 282, "font-size": 10, fill: "var(--muted)" }, svg); sl.textContent = "pH 1 (strong acid)";
      var sr = S("text", { x: 340, y: 282, "font-size": 10, fill: "var(--muted)", "text-anchor": "end" }, svg); sr.textContent = "14";
      var marks = S("g", null, svg);
      var r = row(), lit = false;
      btn(r, "📄 Dip blue litmus", function () {
        strips.forEach(function (s, i) { s.style.transform = "translateY(62px)"; A.later(600, function () { s.setAttribute("fill", "#ff5a6e"); }); });
        lit = true; ui.say("Both strips turned <b>red</b>: both are acids. But which one is stronger? Litmus can't tell. Try universal indicator.", "good");
      });
      btn(r, "🌈 Add universal indicator", function () {
        a.style.fill = "#ff8f00"; b.style.fill = "#e53935";
        phs[0].textContent = "pH ≈ 3"; phs[1].textContent = "pH ≈ 1";
        clear(marks); [[3, "ethanoic"], [1, "HCl"]].forEach(function (m, i) { var x = 60 + (m[0] - 1) * 20 + 10; S("path", { d: "M" + x + "," + (258 - 2) + " l-6,-8 h12 z", fill: "var(--ink)" }, marks); var tx = S("text", { x: x, y: 246 - i * 11, "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: "var(--ink)" }, marks); tx.textContent = m[1]; });
        ui.say("Universal indicator shows ethanoic acid is <b>orange (higher pH)</b>, but HCl is <b>red (pH ≈ 1)</b>. So ethanoic acid is a <b>weak acid</b>; HCl is a strong mineral acid.", "good");
      });
      eq.innerHTML = "Ethanoic acid, CH₃COOH, belongs to the carboxylic acids (–COOH group).";
      ui.say("Two tubes: <b>dilute ethanoic acid</b> and <b>dilute hydrochloric acid</b>. Are they both acids? Which is stronger?");
    }

    /* 3. esterification + saponification */
    function ester() {
      ui.instr.innerHTML = "👆 Add the three ingredients, then warm the tube.";
      var svg = S("svg", { viewBox: "0 0 400 240", role: "img", "aria-label": "Making an ester" }, pane);
      S("path", { d: "M100,130 V200 Q100,214 114,214 H286 Q300,214 300,200 V130", fill: "none", stroke: "var(--muted)", "stroke-width": 3 }, svg);
      var bath = S("rect", { x: 102, y: 150, width: 196, height: 62, rx: 8, fill: "#cfe8ff", class: C("fill") }, svg);
      var liq = tube(svg, 200, 40, 180, 26, 200, "#f6f0ff");
      var fill = 200, smell = S("g", null, svg), fire = S("text", { x: 200, y: 236, "text-anchor": "middle", "font-size": 20, opacity: 0 }, svg); fire.textContent = "🔥🔥";
      var tl = S("text", { x: 200, y: 28, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: "var(--ink)" }, svg);
      var r = row(), have = { acid: 0, alc: 0, cat: 0 }, made = false, saponified = false, sB;
      function add(k, col, msg) { if (made) return; if (have[k]) { ui.say("Already added!"); return; } have[k] = 1; fill -= k === "cat" ? 8 : 40; liq.setAttribute("y", fill); liq.style.fill = col; ui.say(msg); }
      var b1 = btn(r, "+ Ethanoic acid", function () { add("acid", "#f3f8ff", "Added 1 mL of <b>glacial ethanoic acid</b>."); });
      var b2 = btn(r, "+ Ethanol", function () { add("alc", "#f1f6ff", "Added 1 mL of <b>pure ethanol</b> (an alcohol)."); });
      var b3 = btn(r, "+ Few drops conc. H₂SO₄", function () { add("cat", "#f5f2ea", "Added a few drops of <b>concentrated sulphuric acid</b>: the acid <b>catalyst</b>."); });
      btn(r, "🔥 Warm it", function () {
        if (made) return;
        if (!have.acid || !have.alc) { ui.say("You need both an <b>acid</b> and an <b>alcohol</b> to make an ester.", "bad"); return; }
        fire.setAttribute("opacity", 1); bath.style.fill = "#ffd9c2";
        if (!have.cat) { ui.say("Warming... but without the <b>acid catalyst</b> the reaction is very slow. Add a few drops of conc. H₂SO₄.", "bad"); return; }
        made = true; tl.textContent = "ester formed!";
        ui.say("🌸 Sniff! A <b>sweet, fruity smell</b>. The acid and the alcohol joined to make an <b>ester</b> (ethyl ethanoate) and water. This is <b>esterification</b>. Esters are used in perfumes and flavours.", "good");
        eq.innerHTML = "CH₃COOH + CH₃CH₂OH —(acid)→ CH₃COOCH₂CH₃ + H₂O<br><span style='font-weight:400;font-size:13px'>ethanoic acid + ethanol → ester + water</span>";
        sB = btn(r, "🧴 Add NaOH (saponification)", function () {
          if (saponified) return; saponified = true; tl.textContent = "back to alcohol + salt";
          ui.say("Adding the alkali <b>NaOH</b> turns the ester back into <b>ethanol</b> and <b>sodium ethanoate</b>. This is <b>saponification</b>: the same kind of reaction is used to make <b>soap</b>!", "good");
          eq.innerHTML = "CH₃COOC₂H₅ + NaOH → C₂H₅OH + CH₃COONa<br><span style='font-weight:400;font-size:13px'>ester + sodium hydroxide → ethanol + sodium ethanoate</span>";
        });
      });
      var tick = 0;
      loopFn = function () {
        if (made && !saponified && (tick++ % 28 === 0)) {
          var t = S("text", { x: 185 + Math.random() * 30, y: 40, "font-size": 16, class: C("smell") }, smell); t.textContent = ["🌸", "🍓", "🍐", "🌼"][Math.floor(Math.random() * 4)];
          setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2700);
        }
      };
      eq.innerHTML = "Esters have sweet smells. Let's make one!";
      ui.say("An <b>acid + an alcohol</b> can make an <b>ester</b>. Add the ingredients to the test tube.");
    }

    /* 4. carbonate + lime water */
    function carbonate() {
      ui.instr.innerHTML = "👆 Add sodium carbonate (or hydrogencarbonate) to the acid.";
      var svg = S("svg", { viewBox: "0 0 400 240", role: "img", "aria-label": "Acid and carbonate reaction with lime water test" }, pane);
      var gB = S("g", null, svg), gB2 = S("g", null, svg);
      var acid = tube(svg, 110, 60, 180, 28, 120, "#f2f8ff", "ethanoic acid");
      var lime = tube(svg, 290, 60, 180, 28, 110, "#d6efff", "lime water");
      svg.insertBefore(acid, gB); svg.insertBefore(lime, gB);
      S("path", { d: "M110,60 V30 H290 V160", fill: "none", stroke: "var(--muted)", "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      var r = row(), list = [], list2 = [], travel = [], on = 0, milk = 0, which = null;
      function go(k) {
        which = k; on = 260;
        eq.innerHTML = k === "c" ? "2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂↑" : "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑";
        ui.say("🫧 Fizz! Bubbles of gas form as the acid reacts with the " + (k === "c" ? "sodium carbonate" : "sodium hydrogencarbonate") + ". The gas travels through the tube into the lime water...", "good");
      }
      btn(r, "+ Sodium carbonate", function () { go("c"); });
      btn(r, "+ Sodium hydrogencarbonate", function () { go("h"); });
      loopFn = function () {
        if (on > 0) on--;
        list = bub(gB, list, 110, 30, 205, 122, on > 0 ? 0.5 : 0, function () { travel.push({ p: 0, e: S("circle", { r: 3.5, fill: "var(--muted)" }, svg) }); });
        travel = travel.filter(function (b) {
          b.p += 0.015; var d = b.p * 340, x, y;
          if (d < 30) { x = 110; y = 60 - d; } else if (d < 210) { x = 110 + d - 30; y = 30; } else { x = 290; y = 30 + (d - 210); }
          b.e.setAttribute("cx", x); b.e.setAttribute("cy", y);
          if (b.p >= 1) { b.e.parentNode.removeChild(b.e); list2.push({ x: 290 + (Math.random() - .5) * 10, y: 165, r: 3 }); milk = Math.min(1, milk + 0.012); lime.style.fill = "rgb(" + Math.round(214 + 28 * milk) + "," + Math.round(239 + 3 * milk) + "," + Math.round(255 - 13 * milk) + ")"; lime.setAttribute("opacity", 1); return false; }
          return true;
        });
        list2 = bub(gB2, list2, 290, 4, 165, 112, 0);
        if (milk > 0.6 && which) { which = null; S("text", { x: 290, y: 150, "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: "var(--ink)" }, svg).textContent = "milky!"; ui.say("🥛 The lime water turned <b>milky</b>! That proves the gas is <b>carbon dioxide (CO₂)</b>. Ethanoic acid reacts with carbonates and hydrogencarbonates to give a salt (sodium ethanoate), water and CO₂.", "good"); }
      };
      eq.innerHTML = "Like other acids, ethanoic acid also reacts with bases: NaOH + CH₃COOH → CH₃COONa + H₂O";
      ui.say("Left tube: dilute <b>ethanoic acid</b>. Right tube: fresh <b>lime water</b>. Add a carbonate and watch both tubes.");
    }

    btn(ui.bar, "↺ Reset", function () { open(cur); }, "reset");
    open(0); loop();
    return function () { alive = false; cancelAnimationFrame(raf); A.stop(); clear(el); };
  };
})();
