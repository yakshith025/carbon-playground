/* Oxidation: add alkaline KMnO4 drop by drop to warm ethanol */
(function () {
  "use strict";
  var ID = "oxidation";
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

  var EXTRA = ".P-liq{transition:fill 1.1s ease}.P-dropper{cursor:pointer}.P-dropper:active{transform:translateY(3px)}" +
    ".P-chip rect{transition:fill .5s,stroke .5s}.P-chip{transition:transform .5s;transform-box:fill-box;transform-origin:center}.P-flip{animation:P-flip .6s ease}@keyframes P-flip{50%{transform:scaleY(0)}}" +
    ".P-steam{animation:P-steam 2.4s ease-in-out infinite;opacity:0}@keyframes P-steam{0%{opacity:0;transform:translateY(0)}40%{opacity:.55}100%{opacity:0;transform:translateY(-26px)}}" +
    ".P-eq{font-weight:700;padding:8px 12px;border-radius:12px;border:2px dashed var(--line);margin-top:8px;font-size:14px;text-align:center}";
  var AG = {
    kmno4: { name: "alkaline KMnO₄", col: "#8e24aa", rgb: "142,36,170", after: "colourless", btn: "Alkaline KMnO₄ (purple)" },
    k2cr2o7: { name: "acidified K₂Cr₂O₇", col: "#ff8f00", rgb: "255,143,0", after: "green", btn: "Acidified K₂Cr₂O₇ (orange)" }
  };
  var BASE_COL = "#eaf4ff", TOTAL = 5;

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "💧 Tap the dropper to add drops to the warm ethanol, one at a time.");
    var r1 = H("div", C("row"), ui.stage), ab = [], ag = "kmno4";
    Object.keys(AG).forEach(function (k) { var b = btn(r1, AG[k].btn, function () { ag = k; reset(); }); b.dataset.k = k; ab.push(b); });
    var svg = S("svg", { viewBox: "0 -22 400 282", role: "img", "aria-label": "Test tube in a water bath" }, ui.stage);
    // water bath
    S("path", { d: "M40,120 V238 Q40,250 52,250 H208 Q220,250 220,238 V120", fill: "none", stroke: "var(--muted)", "stroke-width": 3 }, svg);
    var bath = S("rect", { x: 42, y: 150, width: 176, height: 98, rx: 8, fill: "#cfe8ff", opacity: .7 }, svg);
    var steam = S("g", null, svg);
    [70, 110, 180].forEach(function (x, i) { S("path", { d: "M" + x + ",146 q6,-8 0,-16 q-6,-8 0,-16", fill: "none", stroke: "var(--muted)", "stroke-width": 2, class: C("steam"), style: "animation-delay:" + i * 0.7 + "s" }, steam); });
    var fire = S("text", { x: 130, y: 258, "text-anchor": "middle", "font-size": 0 }, svg); fire.textContent = "🔥🔥🔥";
    // test tube
    var clipId = ID + "-clip" + Math.random().toString(36).slice(2, 7);
    var cp = S("clipPath", { id: clipId }, S("defs", null, svg));
    S("path", { d: "M112,50 V212 A18,18 0 0 0 148,212 V50 Z" }, cp);
    var liq = S("rect", { x: 100, y: 140, width: 60, height: 100, fill: BASE_COL, class: C("liq"), "clip-path": "url(#" + clipId + ")" }, svg);
    S("path", { d: "M112,40 V212 A18,18 0 0 0 148,212 V40", fill: "none", stroke: "var(--ink)", "stroke-width": 2.5, "stroke-opacity": .6 }, svg);
    var tl = S("text", { x: 130, y: 196, "text-anchor": "middle", "font-size": 9, "font-weight": 700, fill: "var(--ink)", opacity: .7 }, svg); tl.textContent = "ethanol";
    // dropper
    var dropper = S("g", { class: C("dropper"), tabindex: 0, role: "button", "aria-label": "Add a drop" }, svg);
    S("rect", { x: 124, y: 0, width: 12, height: 26, rx: 3, fill: "#dfe6ee", stroke: "var(--muted)" }, dropper);
    var bulb = S("ellipse", { cx: 130, cy: -4, rx: 13, ry: 10, fill: AG[ag].col }, dropper);
    S("rect", { x: 90, y: -16, width: 80, height: 48, fill: "transparent" }, dropper);
    var drop = S("circle", { cx: 130, cy: 30, r: 0, fill: AG[ag].col }, svg);
    // ethanol molecules (chips)
    var hd = S("text", { x: 310, y: 18, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "var(--muted)" }, svg); hd.textContent = "molecules in the tube";
    var chips = [];
    for (var i = 0; i < TOTAL; i++) {
      var g = S("g", { class: C("chip") }, svg);
      var r = S("rect", { x: 240, y: 28 + i * 44, width: 140, height: 36, rx: 12, fill: "var(--bg)", stroke: "var(--line)", "stroke-width": 2 }, g);
      var t = S("text", { x: 310, y: 51 + i * 44, "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: "var(--ink)" }, g);
      chips.push({ g: g, r: r, t: t });
    }
    var eq = H("div", C("eq"), ui.stage);
    var r2 = H("div", C("row"), ui.stage); r2.style.marginTop = "8px";
    var addB = btn(r2, "💧 Add a drop", addDrop);
    var warmB = btn(r2, "", function () { warm = !warm; setWarm(); if (warm && pending > 0) A.later(500, react); });
    var left, excess, pending, converted, warm, busy;

    function liquidColour() {
      if (excess > 0 || pending > 0) { var n = excess + pending; return "rgba(" + AG[ag].rgb + "," + Math.min(0.9, 0.3 + 0.12 * n) + ")"; }
      if (ag === "k2cr2o7" && converted > 0) return "rgba(46,160,67," + (0.12 + 0.1 * converted) + ")";
      return BASE_COL;
    }
    function setWarm() {
      warmB.innerHTML = warm ? "🔥 Water bath: warm" : "❄️ Water bath: cold";
      warmB.classList.toggle(ID + "-on", warm);
      steam.style.display = warm ? "" : "none"; fire.setAttribute("font-size", warm ? 16 : 0);
      bath.setAttribute("fill", warm ? "#ffd9c2" : "#cfe8ff");
    }
    function addDrop() {
      if (busy) return; busy = true;
      drop.setAttribute("fill", AG[ag].col);
      A.tween(450, function (t) { drop.setAttribute("cy", 30 + t * 110); drop.setAttribute("r", 5); }, function () {
        drop.setAttribute("r", 0); busy = false;
        liq.style.fill = "rgb(" + AG[ag].rgb + ")";
        if (left > 0 && warm) { A.later(500, function () { react(true); }); }
        else if (left > 0) { pending++; A.later(500, function () { liq.style.fill = liquidColour(); }); ui.say("The colour stays... The bath is <b>cold</b>, so the reaction is very slow. Oxidation of ethanol needs <b>heat</b>: switch the water bath to warm!", "bad"); }
        else { excess++; A.later(500, function () { liq.style.fill = liquidColour(); }); ui.say("Now the " + (ag === "kmno4" ? "purple" : "orange") + " colour <b>stays</b>! All the ethanol has been oxidised, so there is nothing left to use up the " + AG[ag].name + ". This is the <b>excess</b>.", "good"); }
      });
    }
    function react(single) {
      var n = single ? 1 : pending, done = 0; if (!single) pending = 0;
      for (var j = 0; j < n && left > 0; j++) {
        var c = chips[TOTAL - left]; left--; converted++; done++;
        c.g.classList.remove(ID + "-flip"); void c.g.getBoundingClientRect(); c.g.classList.add(ID + "-flip");
        (function (c) { A.later(300, function () { c.t.textContent = "CH₃COOH"; c.r.setAttribute("fill", "#e9f7ef"); c.r.setAttribute("stroke", "var(--good)"); }); })(c);
      }
      if (!single) excess += n - done;
      liq.style.fill = liquidColour();
      ui.say(left > 0 ? "The " + (ag === "kmno4" ? "purple colour <b>disappeared</b>" : "orange colour turned <b>green</b>") + "! The " + AG[ag].name + " was used up giving oxygen to ethanol, turning one molecule into <b>ethanoic acid</b>. " + left + " ethanol molecule" + (left === 1 ? "" : "s") + " left." : "All 5 ethanol molecules are now <b>ethanoic acid</b>. Add one more drop and see what happens.", "good");
    }
    function reset() {
      A.reset(); left = TOTAL; excess = 0; pending = 0; converted = 0; warm = true; busy = false;
      onOnly(ab, ab.filter(function (b) { return b.dataset.k === ag; })[0]);
      bulb.setAttribute("fill", AG[ag].col); liq.style.fill = BASE_COL; drop.setAttribute("r", 0); setWarm();
      chips.forEach(function (c) { c.t.textContent = "CH₃CH₂OH"; c.r.setAttribute("fill", "var(--bg)"); c.r.setAttribute("stroke", "var(--line)"); c.g.classList.remove(ID + "-flip"); });
      eq.innerHTML = "CH₃CH₂OH &nbsp;—(" + AG[ag].name + " + heat)→&nbsp; CH₃COOH<br><span style='font-weight:400;font-size:13px'>Ethanol → ethanoic acid. The " + AG[ag].name + " is an <b>oxidising agent</b>: it adds oxygen.</span>";
      ui.say("The tube holds warm <b>ethanol</b>. The dropper has " + AG[ag].name + " (" + (ag === "kmno4" ? "purple" : "orange") + "). Add a drop and watch the colour.");
    }
    dropper.addEventListener("click", addDrop);
    btn(ui.bar, "↺ Reset", function () { ag = "kmno4"; reset(); }, "reset");
    reset();
    return function () { A.stop(); clear(el); };
  };
})();
