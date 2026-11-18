/* Combustion: air-hole slider gives blue clean flame vs yellow sooty flame */
(function () {
  "use strict";
  var ID = "combustion";
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

  var EXTRA = ".P-lab{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);font-weight:700}" +
    ".P-eq{font-weight:700;padding:8px 12px;border-radius:12px;border:2px dashed var(--line);margin-top:8px;font-size:14px;text-align:center}" +
    ".P-meter{flex:1;min-width:120px;height:14px;border-radius:999px;background:var(--bg);border:1px solid var(--line);overflow:hidden}.P-meter div{height:100%;border-radius:999px;background:linear-gradient(90deg,#ffb300,#ff5722);transition:width .3s}";
  function clamp(x) { return Math.max(0, Math.min(1, x)); }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "🎚️ Slide the air-hole control and watch the flame change.");
    var fr = H("div", C("row"), ui.stage), fbs = [], fuel = "methane";
    H("span", null, fr, "Fuel:");
    fbs.push(btn(fr, "Methane (saturated)", function () { fuel = "methane"; onOnly(fbs, fbs[0]); bucket = -1; }));
    fbs.push(btn(fr, "Ethyne (unsaturated)", function () { fuel = "ethyne"; onOnly(fbs, fbs[1]); bucket = -1; }));
    onOnly(fbs, fbs[0]);
    var svg = S("svg", { viewBox: "0 0 400 290", role: "img", "aria-label": "Burner flame" }, ui.stage);
    var defs = S("defs", null, svg);
    var gy = S("linearGradient", { id: ID + "-gy", x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
    S("stop", { offset: "0", "stop-color": "#ff8f00" }, gy); S("stop", { offset: "0.6", "stop-color": "#ffc107" }, gy); S("stop", { offset: "1", "stop-color": "#fff176", "stop-opacity": "0.7" }, gy);
    var gbl = S("linearGradient", { id: ID + "-gb", x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
    S("stop", { offset: "0", "stop-color": "#1e40ff" }, gbl); S("stop", { offset: "1", "stop-color": "#7fb2ff", "stop-opacity": "0.6" }, gbl);
    // pan
    S("rect", { x: 120, y: 34, width: 160, height: 16, rx: 6, fill: "#b8c0c8", stroke: "var(--muted)", "stroke-width": 2 }, svg);
    S("rect", { x: 270, y: 38, width: 70, height: 6, rx: 3, fill: "var(--muted)" }, svg);
    var soot = S("rect", { x: 122, y: 42, width: 156, height: 8, rx: 4, fill: "#111", opacity: 0 }, svg);
    var panLab = S("text", { x: 200, y: 24, "text-anchor": "middle", "font-size": 12, fill: "var(--muted)" }, svg); panLab.textContent = "metal plate";
    var gp = S("g", null, svg);
    var fy = S("path", { fill: "url(#" + ID + "-gy)" }, svg), fbp = S("path", { fill: "url(#" + ID + "-gb)" }, svg), fi = S("path", { fill: "#cfe3ff", opacity: 0.9 }, svg);
    // burner
    S("rect", { x: 186, y: 192, width: 28, height: 76, rx: 4, fill: "#9aa3ad", stroke: "var(--ink)", "stroke-opacity": .3 }, svg);
    S("rect", { x: 150, y: 266, width: 100, height: 14, rx: 6, fill: "var(--muted)" }, svg);
    S("rect", { x: 186, y: 232, width: 28, height: 16, fill: "#3b4048" }, svg);
    var collar = S("rect", { x: 184, y: 230, width: 32, height: 20, rx: 4, fill: "var(--accent-2)" }, svg);
    var hole = S("rect", { x: 193, y: 235, width: 14, height: 10, rx: 3, fill: "#222" }, svg);
    var airLab = S("text", { x: 228, y: 244, "font-size": 12, fill: "var(--muted)" }, svg); airLab.textContent = "← air hole";
    S("path", { d: "M150,273 H110", stroke: "var(--muted)", "stroke-width": 6, "stroke-linecap": "round" }, svg);
    var gasLab = S("text", { x: 96, y: 262, "font-size": 12, fill: "var(--muted)", "text-anchor": "middle" }, svg); gasLab.textContent = "gas";
    var arrows = S("g", null, svg);
    var lab = H("div", C("lab"), ui.stage, "<span>air hole closed</span><span>wide open</span>");
    var range = H("input", C("range"), ui.stage); range.type = "range"; range.min = 0; range.max = 100; range.value = 15;
    range.setAttribute("aria-label", "Air hole opening");
    var mrow = H("div", C("row"), ui.stage); mrow.style.marginTop = "6px";
    H("span", null, mrow, "🔥 Heat given:"); var meter = H("div", C("meter"), mrow), mfill = H("div", null, meter);
    var eq = H("div", C("eq"), ui.stage);
    btn(ui.bar, "🧽 Clean the plate", function () { sootAmt = 0; });
    var parts = [], sootAmt = 0, raf = 0, alive = true, bucket = -1, t0 = performance.now();

    function flame(w, h, sway) {
      var x = 200, b = 192;
      return "M" + (x - w) + "," + b + " C" + (x - w * 1.25) + "," + (b - h * 0.45) + " " + (x - w * 0.35 + sway) + "," + (b - h * 0.8) + " " + (x + sway) + "," + (b - h) +
        " C" + (x + w * 0.35 + sway) + "," + (b - h * 0.8) + " " + (x + w * 1.25) + "," + (b - h * 0.45) + " " + (x + w) + "," + b + " Z";
    }
    function sootiness(air) { return fuel === "methane" ? clamp(1 - air / 70) : clamp(1 - air / 160); }
    function caption(s, air) {
      var b = s < 0.06 ? 0 : s < 0.5 ? 1 : 2; if (b === bucket) return; bucket = b;
      var full = fuel === "methane" ? "CH₄ + 2O₂ → CO₂ + 2H₂O + heat + light" : "2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O + heat + light";
      if (b === 0) { ui.say("💙 <b>Clean blue flame.</b> Plenty of oxygen comes in through the air hole, so the fuel burns <b>completely</b> to carbon dioxide and water. Lots of heat, no soot. Gas stoves have air holes for exactly this reason.", "good"); eq.innerHTML = "Complete combustion: " + full; }
      else if (b === 1) { ui.say("Some yellow is appearing. There is not quite enough oxygen, so a little carbon is left unburnt. " + (fuel === "ethyne" ? "Unsaturated fuels like ethyne give a sooty yellow flame even with the air hole open." : "Open the air hole wider!")); eq.innerHTML = "Partly incomplete combustion: some carbon (soot) is left over"; }
      else { ui.say("💛 <b>Yellow, smoky flame.</b> Not enough oxygen means <b>incomplete combustion</b>: tiny unburnt carbon particles glow yellow and leave black <b>soot</b> on the plate. Less heat, and the fuel is wasted.", "bad"); eq.innerHTML = "Incomplete combustion: fuel + too little O₂ → soot (C) + less heat"; }
    }
    function loop(now) {
      if (!alive) return;
      var t = (now - t0) / 1000, air = +range.value, s = sootiness(air);
      hole.setAttribute("width", Math.max(1, 14 * air / 100)); hole.setAttribute("x", 200 - 7 * air / 100);
      var fl = 1 + 0.06 * Math.sin(t * 9) + 0.04 * Math.sin(t * 23 + 1);
      fy.setAttribute("d", flame(20 + 10 * s, (80 + 70 * s) * fl, 7 * s * Math.sin(t * 5)));
      fy.setAttribute("opacity", Math.min(1, s * 1.4));
      var hb = (62 - 10 * s) * (1 + 0.02 * Math.sin(t * 17));
      fbp.setAttribute("d", flame(15, hb, 0)); fbp.setAttribute("opacity", 1 - s * 0.6);
      fi.setAttribute("d", flame(8, hb * 0.45, 0)); fi.setAttribute("opacity", 0.9 - s * 0.5);
      // soot particles
      if (Math.random() < s * 0.7) parts.push({ x: 200 + (Math.random() - 0.5) * 16, y: 192 - (80 + 70 * s), vx: (Math.random() - 0.5) * 0.6, vy: -0.9 - Math.random() * 0.8, r: 2 + Math.random() * 2.5, e: null });
      parts = parts.filter(function (p) {
        p.x += p.vx; p.y += p.vy;
        var hit = p.y < 52 && p.x > 120 && p.x < 280;
        if (hit || p.y < 0) { if (hit) sootAmt = Math.min(0.92, sootAmt + 0.0025); if (p.e && p.e.parentNode) p.e.parentNode.removeChild(p.e); return false; }
        if (!p.e) p.e = S("circle", { r: p.r, fill: "#333", opacity: 0.75 }, gp);
        p.e.setAttribute("cx", p.x); p.e.setAttribute("cy", p.y);
        return true;
      });
      // air arrows when hole open
      clear(arrows);
      if (air > 8) for (var i = 0; i < 3; i++) { var ph = ((t * 1.5 + i / 3) % 1); S("text", { x: 250 - ph * 40, y: 236 + i * 2, "font-size": 12, fill: "var(--nitrogen)", opacity: (1 - ph) * air / 100 }, arrows).textContent = "←"; }
      soot.setAttribute("opacity", sootAmt);
      mfill.style.width = Math.round((1 - s * 0.6) * 100) + "%";
      caption(s, air);
      raf = requestAnimationFrame(loop);
    }
    btn(ui.bar, "↺ Reset", function () { range.value = 15; sootAmt = 0; fuel = "methane"; onOnly(fbs, fbs[0]); bucket = -1; parts.forEach(function (p) { if (p.e && p.e.parentNode) p.e.parentNode.removeChild(p.e); }); parts = []; }, "reset");
    raf = requestAnimationFrame(loop);
    return function () { alive = false; cancelAnimationFrame(raf); clear(el); };
  };
})();
