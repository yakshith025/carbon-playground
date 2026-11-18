/* Substitution: chlorine replaces hydrogens of methane one by one in sunlight */
(function () {
  "use strict";
  var ID = "substitution";
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

  var EXTRA = ".P-cl2{cursor:grab}.P-cl2:active{cursor:grabbing}.P-cl2 circle:first-child{stroke:var(--accent-2);stroke-width:3;stroke-opacity:1}" +
    ".P-sky{transition:fill .6s}.P-sun{transition:opacity .6s}.P-rays{animation:P-spin 8s linear infinite;transform-box:fill-box;transform-origin:center}@keyframes P-spin{to{transform:rotate(360deg)}}" +
    ".P-eq{font-weight:700;padding:8px 12px;border-radius:12px;border:2px dashed var(--line);margin-top:8px;font-size:14px;text-align:center}";
  var NAMES = ["methane", "chloromethane", "dichloromethane", "trichloromethane (chloroform)", "tetrachloromethane (carbon tetrachloride)"];
  var FORM = ["CH₄", "CH₃Cl", "CH₂Cl₂", "CHCl₃", "CCl₄"];
  var CX = 165, CY = 128, BL = 46, ORDER = [0, 270, 180, 90], SP = { x: 60, y: 228 };
  function rad(d) { return d * Math.PI / 180; }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "☀️ Switch on the sunlight, then drag Cl₂ onto the methane (or tap it).");
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "0 0 400 265", role: "img", "aria-label": "Methane reacting with chlorine" }, ui.stage);
    var sky = S("rect", { x: 0, y: 0, width: 400, height: 265, rx: 16, class: C("sky") }, svg);
    var sun = S("g", { class: C("sun") }, svg);
    var rays = S("g", { class: C("rays") }, sun);
    for (var i = 0; i < 8; i++) { var a = rad(i * 45); S("line", { x1: 360 + 22 * Math.cos(a), y1: 36 + 22 * Math.sin(a), x2: 360 + 32 * Math.cos(a), y2: 36 + 32 * Math.sin(a), stroke: "#ffb300", "stroke-width": 4, "stroke-linecap": "round" }, rays); }
    S("circle", { cx: 360, cy: 36, r: 17, fill: "#ffd54f" }, sun);
    var moon = S("text", { x: 360, y: 44, "text-anchor": "middle", "font-size": 24, class: C("sun") }, svg); moon.textContent = "🌙";
    var trayL = S("text", { x: 350, y: 92, "text-anchor": "middle", "font-size": 11, "font-weight": 700 }, svg); trayL.textContent = "HCl made";
    S("rect", { x: 315, y: 98, width: 72, height: 160, rx: 12, fill: "none", stroke: "var(--line)", "stroke-width": 2, "stroke-dasharray": "5 4" }, svg);
    var gM = S("g", null, svg), gT = S("g", null, svg), gC = S("g", null, svg);
    var eq = H("div", C("eq"), ui.stage);
    var r1 = H("div", C("row"), ui.stage); r1.style.marginTop = "8px";
    var sunB = btn(r1, "", function () { light = !light; setLight(); });
    var autoB = btn(r1, "🤖 Add Cl₂ for me", function () { if (!busy && step < 4) react(); });
    var light, step, busy, subs, loose, cl2, cl2p, hcl;

    function setLight() {
      sunB.innerHTML = light ? "☀️ Sunlight: ON" : "🌑 Sunlight: OFF (dark)"; sunB.classList.toggle(ID + "-on", light);
      sky.setAttribute("fill", light ? "#e3f2ff" : "#27314a"); sun.setAttribute("opacity", light ? 1 : 0); moon.setAttribute("opacity", light ? 0 : 1);
      trayL.setAttribute("fill", light ? "var(--ink)" : "#cfd8e3");
    }
    function render() {
      clear(gM);
      var c = { x: CX, y: CY };
      subs.forEach(function (s) { if (s.on) bondLines(gM, c, s, 1); });
      loose.forEach(function (p) { if (p.bond) bondLines(gM, p.a, p.b, 1); });
      atomG(gM, CX, CY, "C", 19);
      subs.forEach(function (s) { if (s.on) atomG(gM, s.x, s.y, s.el, s.el === "H" ? 12 : 16); });
      loose.forEach(function (p) { [p.a, p.b].forEach(function (q) { if (q.x > -50) atomG(gM, q.x, q.y, q.el, q.el === "H" ? 12 : 16); }); });
      clear(gT);
      for (var j = 0; j < hcl; j++) { var y = 122 + j * 36; bondLines(gT, { x: 338, y: y }, { x: 362, y: y }, 1); atomG(gT, 338, y, "H", 10); atomG(gT, 362, y, "Cl", 13); }
      info.innerHTML = "<span class='" + C("big") + "'>" + FORM[step] + "</span><span class='" + C("tag") + "'>" + NAMES[step] + "</span><span class='" + C("tag") + "'>H replaced: " + step + " / 4</span>";
    }
    function makeCl2() {
      clear(gC); cl2p = { x: SP.x, y: SP.y };
      if (step >= 4) return;
      cl2 = S("g", { class: C("cl2") }, gC); S("circle", { r: 36, fill: "transparent", "stroke-dasharray": "4 4" }, cl2);
      bondLines(cl2, { x: -14, y: 0 }, { x: 14, y: 0 }, 1); atomG(cl2, -14, 0, "Cl", 15); atomG(cl2, 14, 0, "Cl", 15);
      cl2.setAttribute("transform", "translate(" + cl2p.x + "," + cl2p.y + ")");
      cl2.addEventListener("pointerdown", startDrag);
    }
    function moveCl2() { cl2.setAttribute("transform", "translate(" + cl2p.x + "," + cl2p.y + ")"); }
    function startDrag(ev) {
      if (busy) return; ev.preventDefault();
      var p = pt(svg, ev), off = { x: cl2p.x - p.x, y: cl2p.y - p.y }, sx = p.x, sy = p.y, moved = 0;
      try { cl2.setPointerCapture(ev.pointerId); } catch (e) { }
      cl2.onpointermove = function (e) { var q = pt(svg, e); moved = Math.max(moved, Math.hypot(q.x - sx, q.y - sy)); cl2p = { x: Math.max(20, Math.min(380, q.x + off.x)), y: Math.max(20, Math.min(250, q.y + off.y)) }; moveCl2(); };
      cl2.onpointerup = cl2.onpointercancel = function () {
        cl2.onpointermove = null; cl2.onpointerup = null;
        if (moved < 6 || Math.hypot(cl2p.x - CX, cl2p.y - CY) < 90) react(); else back();
      };
    }
    function back() { var f = { x: cl2p.x, y: cl2p.y }; A.tween(350, function (t) { cl2p = { x: f.x + (SP.x - f.x) * t, y: f.y + (SP.y - f.y) * t }; moveCl2(); }); }
    function react() {
      busy = true;
      var s = subs[step], ang = ORDER[step], ux = Math.cos(rad(ang)), uy = Math.sin(rad(ang));
      if (!light) {
        var f = { x: cl2p.x, y: cl2p.y }, tgt = { x: CX - 70, y: CY + 70 };
        A.tween(400, function (t) { cl2p = { x: f.x + (tgt.x - f.x) * t, y: f.y + (tgt.y - f.y) * t }; moveCl2(); }, function () { back(); busy = false; });
        ui.say("🌑 Nothing happens in the dark: the Cl₂ just drifts away. Chlorine reacts with methane <b>in the presence of sunlight</b>. Turn the sun on!", "bad");
        return;
      }
      var f2 = { x: cl2p.x, y: cl2p.y }, near = { x: CX + ux * 100 - 14, y: CY + uy * 100 };
      A.tween(400, function (t) { cl2p = { x: f2.x + (near.x - f2.x) * t, y: f2.y + (near.y - f2.y) * t }; moveCl2(); }, function () {
        clear(gC);
        var a = { el: "Cl", x: near.x - 14, y: near.y }, b = { el: "Cl", x: near.x + 14, y: near.y }, h = { el: "H", x: s.x, y: s.y };
        s.on = false; s.el = "none"; s.x = -99; s.y = -99;
        var pair = { a: h, b: b, bond: false };
        var a0 = { x: a.x, y: a.y }, h0 = { x: h.x, y: h.y }, b0 = { x: b.x, y: b.y };
        var aF = { x: CX + ux * BL * 1.25, y: CY + uy * BL * 1.25 }, hF = { x: CX + ux * 92 + uy * 34, y: CY + uy * 92 - ux * 34 }, bF = { x: hF.x + 24, y: hF.y };
        var aObj = { el: "Cl", x: a0.x, y: a0.y };
        loose = [pair, { a: aObj, b: { el: "H", x: -99, y: -99 }, bond: false }];
        A.tween(600, function (t) {
          aObj.x = a0.x + (aF.x - a0.x) * t; aObj.y = a0.y + (aF.y - a0.y) * t;
          h.x = h0.x + (hF.x - h0.x) * t; h.y = h0.y + (hF.y - h0.y) * t;
          b.x = b0.x + (bF.x - b0.x) * t; b.y = b0.y + (bF.y - b0.y) * t;
          pair.bond = t > 0.7; render();
        }, function () {
          s.el = "Cl"; s.x = aF.x; s.y = aF.y; s.on = true; loose = [pair]; step++; render();
          var slot = { x: 338, y: 122 + hcl * 36 }, h1 = { x: h.x, y: h.y }, b1 = { x: b.x, y: b.y };
          A.tween(500, function (t) { h.x = h1.x + (slot.x - h1.x) * t; h.y = h1.y + (slot.y - h1.y) * t; b.x = b1.x + (slot.x + 24 - b1.x) * t; b.y = b1.y + (slot.y - b1.y) * t; render(); }, function () {
            loose = []; hcl++; render(); busy = false; makeCl2();
            eq.innerHTML = FORM[step - 1] + " + Cl₂ —(sunlight)→ " + FORM[step] + " + HCl";
            ui.say(step < 4 ? "☀️ One <b>Cl took the place of one H</b>: " + FORM[step - 1] + " became <b>" + FORM[step] + "</b>, " + NAMES[step] + ". The H left with the other Cl as <b>HCl</b>. Replacing one atom by another is a <b>substitution reaction</b>. Again?" : "🎉 All 4 H atoms replaced, one by one! Now it is <b>CCl₄</b>, carbon tetrachloride. Four Cl₂ molecules used, four HCl made.", "good");
          });
        });
      });
    }
    function reset() {
      A.reset(); light = false; step = 0; busy = false; hcl = 0; loose = [];
      subs = ORDER.map(function (ang) { return { el: "H", x: CX + BL * Math.cos(rad(ang)), y: CY + BL * Math.sin(rad(ang)), on: true }; });
      setLight(); render(); makeCl2();
      eq.innerHTML = "CH₄ + Cl₂ —(sunlight)→ CH₃Cl + HCl";
      ui.say("<b>Methane</b>, CH₄, is saturated, so it doesn't do addition reactions. But in <b>sunlight</b>, chlorine can swap places with its H atoms. Try it in the dark first!");
    }
    btn(ui.bar, "↺ Reset", reset, "reset");
    reset();
    return function () { A.stop(); clear(el); };
  };
})();
