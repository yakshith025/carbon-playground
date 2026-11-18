/* Addition reaction: hydrogenation of C=C with a nickel catalyst (oil -> solid fat) */
(function () {
  "use strict";
  var ID = "addition";
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

  var EXTRA = ".P-h2{cursor:grab}.P-h2:active{cursor:grabbing}.P-h2 circle:first-child{stroke:var(--accent);stroke-width:3;stroke-opacity:1}" +
    ".P-wave{animation:P-wave 2s linear infinite}@keyframes P-wave{to{transform:translateX(-20px)}}" +
    ".P-ni{transition:opacity .4s}.P-fade{transition:opacity .4s}";
  var TOTAL = 4, SP = { x: 60, y: 238 }, C1 = { x: 170, y: 92 }, C2 = { x: 230, y: 92 };

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "✋ Turn on the nickel catalyst, then drag an H₂ molecule onto the C=C double bond.");
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "0 0 400 285", role: "img", "aria-label": "Hydrogenation of a double bond" }, ui.stage);
    var gNi = S("g", { class: C("ni") }, svg), gMol = S("g", { class: C("fade") }, svg), gBk = S("g", null, svg), gH2 = S("g", null, svg);
    // nickel surface
    var niOn = S("g", null, gNi);
    S("rect", { x: 92, y: 160, width: 216, height: 24, rx: 8, fill: "#9aa3ad" }, niOn);
    for (var i = 0; i < 12; i++) S("circle", { cx: 102 + i * 18, cy: 160, r: 7, fill: "#b9c1c9", stroke: "#8a939c" }, niOn);
    var nt = S("text", { x: 200, y: 177, "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: "#fff" }, niOn); nt.textContent = "Ni catalyst surface";
    var niOff = S("rect", { x: 92, y: 160, width: 216, height: 24, rx: 8, fill: "none", stroke: "var(--line)", "stroke-dasharray": "6 5", "stroke-width": 2 }, gNi);
    var lbl = S("text", { x: 60, y: 194, "text-anchor": "middle", "font-size": 11, fill: "var(--muted)" }, svg); lbl.textContent = "hydrogen gas";
    // beaker
    S("path", { d: "M300,196 V266 Q300,276 310,276 H370 Q380,276 380,266 V196", fill: "none", stroke: "var(--muted)", "stroke-width": 3 }, gBk);
    var oil = S("rect", { x: 302, y: 222, width: 76, height: 52, rx: 6 }, gBk);
    var clipId = ID + "-c" + Math.random().toString(36).slice(2, 7);
    S("rect", { x: 302, y: 212, width: 76, height: 20 }, S("clipPath", { id: clipId }, S("defs", null, svg)));
    var waveG = S("g", { "clip-path": "url(#" + clipId + ")" }, gBk);
    var wave = S("path", { d: "M302,222 q5,-5 10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 V232 H302 Z", class: C("wave") }, waveG);
    var crystals = S("g", null, gBk);
    [[315, 238], [340, 250], [362, 236], [325, 262], [355, 262]].forEach(function (p) { S("path", { d: "M" + p[0] + "," + (p[1] - 6) + " l5,3 v6 l-5,3 l-5,-3 v-6 z", fill: "none", stroke: "#c9a55a", "stroke-width": 1.5 }, crystals); });
    var bl = S("text", { x: 340, y: 190, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "var(--ink)" }, gBk);
    var r1 = H("div", C("row"), ui.stage); r1.style.marginTop = "8px";
    var niB = btn(r1, "", function () { ni = !ni; setNi(); });
    var autoB = btn(r1, "🤖 Add H₂ for me", function () { if (!busy && done < TOTAL) addH2(); });
    var ni, done, busy, h2, h2p;

    function drawMol(sat, hb) {
      clear(gMol);
      var R1 = { x: 108, y: 92 }, R2 = { x: 292, y: 92 }, T1 = { x: C1.x, y: 50 }, T2 = { x: C2.x, y: 50 };
      bondLines(gMol, R1, C1, 1); bondLines(gMol, C2, R2, 1);
      bondLines(gMol, C1, C2, sat ? 1 : 2, sat ? "var(--ink)" : "var(--bad)", 4);
      bondLines(gMol, C1, T1, 1); bondLines(gMol, C2, T2, 1);
      if (sat) { bondLines(gMol, C1, hb[0], 1); bondLines(gMol, C2, hb[1], 1); }
      atomG(gMol, R1.x, R1.y, "R", 17); atomG(gMol, R2.x, R2.y, "R", 17);
      atomG(gMol, C1.x, C1.y, "C", 18); atomG(gMol, C2.x, C2.y, "C", 18);
      atomG(gMol, T1.x, T1.y, "H", 12); atomG(gMol, T2.x, T2.y, "H", 12);
      if (sat) { atomG(gMol, hb[0].x, hb[0].y, "H", 12, C("popin")); atomG(gMol, hb[1].x, hb[1].y, "H", 12, C("popin")); }
      var rl = S("text", { x: 200, y: 20, "text-anchor": "middle", "font-size": 12, fill: "var(--muted)" }, gMol);
      rl.textContent = sat ? "now a single bond: saturated" : "part of an oil molecule: R–CH=CH–R";
    }
    function makeH2() {
      clear(gH2); h2p = { x: SP.x, y: SP.y };
      h2 = S("g", { class: C("h2") }, gH2); S("circle", { r: 32, fill: "transparent", "stroke-dasharray": "4 4" }, h2);
      bondLines(h2, { x: -11, y: 0 }, { x: 11, y: 0 }, 1);
      h2.a = atomG(h2, -11, 0, "H", 12); h2.b = atomG(h2, 11, 0, "H", 12);
      placeH2();
      h2.addEventListener("pointerdown", startDrag);
    }
    function placeH2() { h2.setAttribute("transform", "translate(" + h2p.x + "," + h2p.y + ")"); }
    function startDrag(ev) {
      if (busy || done >= TOTAL) return;
      ev.preventDefault();
      var p = pt(svg, ev), off = { x: h2p.x - p.x, y: h2p.y - p.y }, sx = p.x, sy = p.y, moved = 0;
      try { h2.setPointerCapture(ev.pointerId); } catch (e) { }
      h2.onpointermove = function (e) { var q = pt(svg, e); moved = Math.max(moved, Math.hypot(q.x - sx, q.y - sy)); h2p = { x: Math.max(20, Math.min(380, q.x + off.x)), y: Math.max(20, Math.min(265, q.y + off.y)) }; placeH2(); };
      h2.onpointerup = h2.onpointercancel = function () {
        h2.onpointermove = null; h2.onpointerup = null;
        if (moved < 6 || Math.hypot(h2p.x - 200, h2p.y - 100) < 75) addH2(); else back();
      };
    }
    function back() { var f = { x: h2p.x, y: h2p.y }; A.tween(350, function (t) { h2p = { x: f.x + (SP.x - f.x) * t, y: f.y + (SP.y - f.y) * t }; placeH2(); }); }
    function addH2() {
      busy = true;
      var f = { x: h2p.x, y: h2p.y }, mid = { x: 200, y: 128 };
      A.tween(450, function (t) { h2p = { x: f.x + (mid.x - f.x) * t, y: f.y + (mid.y - f.y) * t }; placeH2(); }, function () {
        if (!ni) {
          A.tween(250, function (t) { h2p = { x: mid.x + 40 * Math.sin(t * Math.PI), y: mid.y - 30 * Math.sin(t * Math.PI) }; placeH2(); }, function () { back(); busy = false; });
          ui.say("💥 Boing! The H₂ bounced off. Without a <b>catalyst</b> this reaction is far too slow. Switch on the <b>nickel catalyst</b>.", "bad");
          return;
        }
        var hb = [{ x: C1.x, y: 134 }, { x: C2.x, y: 134 }];
        A.tween(400, function (t) {
          h2.a.setAttribute("transform", "translate(" + (-11 + (hb[0].x - mid.x + 11) * t) + "," + (hb[0].y - mid.y) * t + ")");
          h2.b.setAttribute("transform", "translate(" + (11 + (hb[1].x - mid.x - 11) * t) + "," + (hb[1].y - mid.y) * t + ")");
          var ln = h2.querySelector("line"); if (ln) ln.setAttribute("opacity", 1 - t);
        }, function () {
          clear(gH2); drawMol(true, hb); done++; beaker();
          ui.say("✨ H₂ <b>added across</b> the double bond: each carbon got one H, and C=C became C–C. This is an <b>addition reaction</b> (hydrogenation). " + (done < TOTAL ? (TOTAL - done) + " double bond" + (TOTAL - done > 1 ? "s" : "") + " left in the oil." : ""), "good");
          A.later(1500, function () {
            busy = false;
            if (done < TOTAL) { gMol.style.opacity = 0; A.later(400, function () { drawMol(false); gMol.style.opacity = 1; makeH2(); }); }
            else ui.say("🧈 All double bonds are gone! The oil's chains are now <b>saturated</b>, and the liquid oil has become a <b>solid fat</b> (like vanaspati ghee). Note: oils with unsaturated chains are healthier for cooking; saturated (animal) fats are said to be harmful to health.", "good");
          });
        });
      });
    }
    function beaker() {
      var f = done / TOTAL;
      var col = "rgb(" + Math.round(244 + (246 - 244) * f) + "," + Math.round(180 + (231 - 180) * f) + "," + Math.round(0 + (179 - 0) * f) + ")";
      oil.setAttribute("fill", col); wave.setAttribute("fill", col);
      waveG.setAttribute("opacity", 1 - f); crystals.setAttribute("opacity", f);
      oil.setAttribute("y", 222); oil.setAttribute("height", 52);
      bl.textContent = f === 0 ? "liquid oil 🌻" : f < 1 ? "getting thicker" : "solid fat 🧈";
      info.innerHTML = "<span class='" + C("tag") + "'>C=C bonds left: " + (TOTAL - done) + " / " + TOTAL + "</span><span class='" + C("tag") + "'>" + (f === 0 ? "unsaturated oil" : f < 1 ? "partly hydrogenated" : "saturated fat") + "</span><span class='" + C("tag") + "'>R₂C=CR₂ + H₂ —(Ni)→ R₂CH–CHR₂</span>";
    }
    function setNi() { niB.innerHTML = ni ? "⚙️ Nickel catalyst: ON" : "⚙️ Nickel catalyst: OFF"; niB.classList.toggle(ID + "-on", ni); niOn.setAttribute("opacity", ni ? 1 : 0); niOff.setAttribute("opacity", ni ? 0 : 1); }
    function reset() { A.reset(); ni = false; done = 0; busy = false; gMol.style.opacity = 1; setNi(); drawMol(false); makeH2(); beaker(); ui.say("This is part of a <b>vegetable oil</b> molecule. It has C=C double bonds, so it is <b>unsaturated</b> (R = the rest of the long chain). Try dragging H₂ onto the double bond with and without the catalyst."); }
    btn(ui.bar, "↺ Reset", reset, "reset");
    reset();
    return function () { A.stop(); clear(el); };
  };
})();
