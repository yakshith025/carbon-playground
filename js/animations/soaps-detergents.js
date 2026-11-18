/* Soaps and detergents: micelles trap oil; hard water makes scum with soap */
(function () {
  "use strict";
  var ID = "soaps-detergents";
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

  var EXTRA = ".P-oil{cursor:grab}.P-oil:active{cursor:grabbing}.P-water{transition:fill .6s}.P-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--muted);margin-top:4px}.P-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:middle}";
  var N = 16, OR = 22, TAIL = 30, TANK = { x0: 20, x1: 380, y0: 95, y1: 272 };
  function rnd(a, b) { return a + Math.random() * (b - a); }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "✋ Drag the oil drop into the water, add soap, then rinse.");
    var svg = S("svg", { viewBox: "0 0 400 280", role: "img", "aria-label": "Soap molecules cleaning oil" }, ui.stage);
    S("rect", { x: 20, y: 18, width: 130, height: 56, rx: 12, fill: "#e8d9c4", stroke: "#c8b291", "stroke-width": 2 }, svg);
    for (var i = 0; i < 6; i++) S("line", { x1: 30 + i * 20, y1: 22, x2: 30 + i * 20, y2: 70, stroke: "#d6c2a3", "stroke-width": 2 }, svg);
    var cl = S("text", { x: 85, y: 88, "text-anchor": "middle", "font-size": 11, fill: "var(--muted)" }, svg); cl.textContent = "dirty cloth";
    var water = S("rect", { x: TANK.x0, y: TANK.y0, width: TANK.x1 - TANK.x0, height: TANK.y1 - TANK.y0, rx: 14, class: C("water"), fill: "#d6ecff" }, svg);
    S("path", { d: "M20,95 q20,-6 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0", fill: "none", stroke: "#9cc9ef", "stroke-width": 2 }, svg);
    var gIons = S("g", null, svg), gFoam = S("g", null, svg), gMol = S("g", null, svg), gOil = S("g", { class: C("oil") }, svg);
    S("ellipse", { rx: OR, ry: OR * 0.9, fill: "#f2b705", stroke: "#c98f00", "stroke-width": 2 }, gOil);
    S("ellipse", { cx: -7, cy: -7, rx: 6, ry: 4, fill: "#fff", opacity: .5 }, gOil);
    var ot = S("text", { "text-anchor": "middle", y: 4, "font-size": 10, "font-weight": 800, fill: "#7a5600" }, gOil); ot.textContent = "oil";
    H("div", C("legend"), ui.stage, "<span><i style='background:var(--accent)'></i>soap head: ionic, loves water</span><span><i style='background:var(--ink)'></i>tail: hydrocarbon, loves oil</span>");
    var r1 = H("div", C("row"), ui.stage); r1.style.marginTop = "8px";
    var soapB = btn(r1, "🧼 Add soap", function () { addAgent("soap"); });
    var detB = btn(r1, "🧴 Add detergent", function () { addAgent("det"); });
    var rinseB = btn(r1, "🌊 Rinse / scrub", rinse);
    var r2 = H("div", C("row"), ui.stage); H("span", null, r2, "Water:");
    var wb = [btn(r2, "Soft water", function () { setHard(false); }), btn(r2, "Hard water (Ca²⁺, Mg²⁺)", function () { setHard(true); })];
    var oil, mols, agent, hard, washed, ions, raf = 0, alive = true, lastMsg = "", tick = 0, foam = [];

    function inWater() { return oil.x > TANK.x0 + 25 && oil.x < TANK.x1 - 25 && oil.y > TANK.y0 + 25 && oil.y < TANK.y1 - 22 && !washed; }
    function setOil() { gOil.setAttribute("transform", "translate(" + oil.x + "," + oil.y + ")"); gOil.setAttribute("opacity", oil.o); }
    gOil.addEventListener("pointerdown", function (ev) {
      if (washed || oil.leaving) return; ev.preventDefault();
      var p = pt(svg, ev), off = { x: oil.x - p.x, y: oil.y - p.y };
      try { gOil.setPointerCapture(ev.pointerId); } catch (e) { }
      gOil.onpointermove = function (e) { var q = pt(svg, e); oil.x = Math.max(30, Math.min(370, q.x + off.x)); oil.y = Math.max(30, Math.min(250, q.y + off.y)); setOil(); };
      gOil.onpointerup = gOil.onpointercancel = function () {
        gOil.onpointermove = null; gOil.onpointerup = null;
        if (!inWater() && oil.y > TANK.y0 - 10) { oil.x = Math.max(TANK.x0 + 30, Math.min(TANK.x1 - 30, oil.x)); oil.y = Math.max(TANK.y0 + 30, Math.min(TANK.y1 - 26, oil.y)); }
        if (!inWater()) { oil.x = 85; oil.y = 46; }
        setOil(); status();
      };
    });
    function mkMol(m) {
      m.g = S("g", null, gMol);
      var pts = []; for (var k = 0; k <= 6; k++) pts.push((-5 - k * (TAIL - 5) / 6) + "," + (k % 2 ? 3 : -3));
      m.tail = S("polyline", { points: pts.join(" "), fill: "none", stroke: "var(--ink)", "stroke-width": 2.2, "stroke-linejoin": "round", "stroke-linecap": "round" }, m.g);
      m.head = S("circle", { r: 5.5, fill: agent === "soap" ? "var(--accent)" : "var(--nitrogen)", stroke: "#fff", "stroke-width": 1.2 }, m.g);
    }
    function addAgent(k) {
      if (washed) { ui.say("The cloth is already clean! Press Reset to try again."); return; }
      agent = k; onOnly([soapB, detB], k === "soap" ? soapB : detB);
      clear(gMol); mols = [];
      for (var i = 0; i < N; i++) { var m = { x: rnd(60, 340), y: TANK.y0 - 10, a: rnd(0, 360), state: "free", tx: rnd(50, 350), ty: rnd(130, 255), ta: rnd(0, 360) }; mkMol(m); mols.push(m); }
      assign(); status(true);
    }
    function assign() {
      if (!mols.length) return;
      var nScum = hard && agent === "soap" ? Math.round(N * 0.75) : 0;
      mols.forEach(function (m, i) {
        m.state = i < nScum ? "scum" : inWater() ? "micelle" : "free";
        m.head.setAttribute("fill", m.state === "scum" ? "#9aa3ad" : agent === "soap" ? "var(--accent)" : "var(--nitrogen)");
        if (m.state === "scum") { m.tx = rnd(40, 360); m.ty = rnd(TANK.y0 + 6, TANK.y0 + 22); m.ta = rnd(0, 360); }
      });
    }
    function setHard(h) {
      hard = h; onOnly(wb, wb[h ? 1 : 0]);
      water.setAttribute("fill", h ? "#dfe8e4" : "#d6ecff");
      clear(gIons); ions = [];
      if (h) for (var i = 0; i < 8; i++) { var g = S("g", null, gIons); S("circle", { r: 9, fill: "#c7d2cc", stroke: "#9aa79f" }, g); var t = S("text", { "text-anchor": "middle", dy: "0.35em", "font-size": 7, "font-weight": 800, fill: "#37474f" }, g); t.textContent = i % 2 ? "Mg²⁺" : "Ca²⁺"; ions.push({ g: g, x: rnd(40, 360), y: rnd(120, 260), p: rnd(0, 6) }); }
      if (mols && mols.length) { assign(); status(true); }
      else ui.say(h ? "This is <b>hard water</b>: it contains calcium and magnesium salts. Now add soap and see what happens." : "Soft water. Drag the oil in and add soap.");
    }
    function status(force) {
      var msg, tone = null, sc = mols.filter(function (m) { return m.state === "scum"; }).length;
      if (!mols.length) msg = inWater() ? "Oil and water <b>don't mix</b>: the oil stays as a separate drop. Water alone can't wash it away. Add soap or detergent!" : "Drag the <b>oil drop</b> from the cloth into the water.";
      else if (sc) { msg = "😕 In <b>hard water</b>, soap reacts with calcium and magnesium salts to make an insoluble <b>scum</b> (grey clumps floating). Few soap molecules are left for the oil, so cleaning is poor. Try <b>detergent</b>!"; tone = "bad"; }
      else if (!inWater()) msg = "The " + (agent === "det" ? "detergent" : "soap") + " molecules are swimming freely. Each has an <b>ionic head</b> (loves water) and a long <b>hydrocarbon tail</b> (loves oil). Now drag the oil into the water.";
      else { msg = "✨ The tails dig into the oil and the heads point out into the water: a <b>micelle</b>! The oily dirt is trapped in the middle. Now <b>rinse</b>."; tone = "good"; }
      if (agent === "det" && hard && mols.length) msg += " Detergents work even in hard water: they don't form scum.";
      if (force || msg !== lastMsg) { lastMsg = msg; ui.say(msg, tone); }
    }
    function rinse() {
      if (washed) return;
      var full = mols.length && mols.every(function (m) { return m.state === "micelle"; });
      if (inWater() && full) {
        oil.leaving = true;
        var x0 = oil.x;
        A.tween(1300, function (t) { oil.x = x0 + (470 - x0) * t; oil.o = 1 - t * 0.9; setOil(); }, function () {
          washed = true; oil.o = 0; setOil(); oil.leaving = false;
          ui.say("🎉 Washed away! The micelles carried the oil out with the rinse water. The ionic heads keep micelles apart (they repel each other), so dirt doesn't settle back. Scrubbing or beating clothes helps the micelles grab the dirt.", "good");
        });
      } else if (inWater()) {
        var y0 = oil.y;
        A.tween(500, function (t) { oil.y = y0 + Math.sin(t * Math.PI * 4) * 6; setOil(); });
        ui.say(mols.length ? "The oil is not fully trapped, so most of it stays behind. " + (hard && agent === "soap" ? "The soap was wasted making scum in hard water." : "") : "Water just slides past the oil. Oil and water don't mix! You need soap.", "bad");
      } else ui.say("Put the oil drop into the water first.");
    }
    function loop() {
      if (!alive) return;
      tick++;
      var iw = inWater();
      mols.forEach(function (m, i) {
        if (m.state === "micelle" && !iw && !washed && !oil.leaving) m.state = "free";
        if (m.state === "free" && iw && !(hard && agent === "soap" && i < Math.round(N * 0.75))) m.state = "micelle";
        if (m.state === "micelle" && (iw || oil.leaving)) {
          var micN = mols.filter(function (q) { return q.state === "micelle"; }), idx = micN.indexOf(m), th = idx / micN.length * 2 * Math.PI;
          m.tx = oil.x + (OR + TAIL - 3) * Math.cos(th); m.ty = oil.y + (OR + TAIL - 3) * Math.sin(th); m.ta = th * 180 / Math.PI;
        } else if (m.state === "free" && tick % 120 === i * 7 % 120) { m.tx = rnd(50, 350); m.ty = rnd(130, 255); m.ta = m.a + rnd(-90, 90); }
        if (washed && m.state === "micelle") { m.tx = 470; }
        var k = m.state === "micelle" ? 0.12 : 0.025;
        m.x += (m.tx - m.x) * k; m.y += (m.ty - m.y) * k;
        var da = ((m.ta - m.a) % 360 + 540) % 360 - 180; m.a += da * k;
        m.g.setAttribute("transform", "translate(" + m.x.toFixed(1) + "," + m.y.toFixed(1) + ") rotate(" + m.a.toFixed(1) + ")");
        if (m.state === "scum") m.tail.setAttribute("stroke", "#9aa3ad");
      });
      ions.forEach(function (o) { o.p += 0.02; o.g.setAttribute("transform", "translate(" + (o.x + Math.sin(o.p) * 8).toFixed(1) + "," + (o.y + Math.cos(o.p * 1.3) * 5).toFixed(1) + ")"); });
      // lather on the surface
      var want = !mols.length ? 0 : hard && agent === "soap" ? 3 : 14;
      while (foam.length < want) foam.push(S("circle", { cx: rnd(30, 370), cy: TANK.y0 + rnd(-6, 4), r: rnd(4, 9), fill: "#fff", stroke: "#cfe3f3", class: C("popin") }, gFoam));
      while (foam.length > want) { var f = foam.pop(); f.parentNode.removeChild(f); }
      if (tick % 30 === 0 && mols.length) status();
      raf = requestAnimationFrame(loop);
    }
    function reset() {
      A.reset(); clear(gMol); mols = []; agent = null; washed = false; oil = { x: 85, y: 46, o: 1, leaving: false };
      onOnly([soapB, detB], null); foam.forEach(function (f) { f.parentNode && f.parentNode.removeChild(f); }); foam = [];
      setOil(); lastMsg = ""; setHard(false); status(true);
    }
    btn(ui.bar, "↺ Reset", reset, "reset");
    mols = []; ions = []; reset();
    raf = requestAnimationFrame(loop);
    return function () { alive = false; cancelAnimationFrame(raf); A.stop(); clear(el); };
  };
})();
