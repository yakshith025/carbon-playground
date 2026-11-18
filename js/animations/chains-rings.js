/* Chains, branches and rings: butane vs isobutane, hexane -> cyclohexane -> benzene */
(function () {
  "use strict";
  var ID = "chains-rings";
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

  var EXTRA = ".P-zone{fill:var(--accent);fill-opacity:.08;stroke:var(--accent);stroke-width:2;stroke-dasharray:5 5;transition:fill-opacity .2s}.P-zone.P-near{fill-opacity:.3}" +
    ".P-dragC{cursor:grab}.P-dragC:active{cursor:grabbing}.P-dragC circle:first-child{stroke:var(--accent-2);stroke-width:4;stroke-opacity:1}" +
    ".P-iso{background:var(--good);color:#fff;border-color:var(--good)}";
  var B = 70;

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "");
    var tabs = H("div", C("row"), ui.stage), tb = [];
    tb.push(btn(tabs, "4 carbons: chain or branch", function () { mode4(); }));
    tb.push(btn(tabs, "6 carbons: chain or ring", function () { mode6("chain", true); }));
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "-60 -130 330 210", role: "img", "aria-label": "Carbon skeleton" }, ui.stage);
    var gZ = S("g", null, svg), gM = S("g", null, svg), gD = S("g", null, svg);
    var ctl = H("div", C("row"), ui.stage); ctl.style.marginTop = "8px";
    var mode = 4, zone = 0, c3 = { x: 210, y: 0 }, dragging = false, dragEl = null;
    var ZONES = [{ x: 210, y: 0, to: 2, name: "straight" }, { x: 70, y: -70, to: 1, name: "branched" }];

    /* ---------------- 4 carbons ---------------- */
    function draw4() {
      clear(gM);
      var atoms = [{ el: "C", x: 0, y: 0 }, { el: "C", x: B, y: 0 }, { el: "C", x: 2 * B, y: 0 }, { el: "C", x: c3.x, y: c3.y, noH: dragging }];
      var bonds = [[0, 1, 1], [1, 2, 1]];
      if (!dragging) bonds.push([ZONES[zone].to, 3, 1]);
      var hs = drawMol(gM, atoms, bonds, { r: 17, hlen: 33 });
      atoms[3].g.parentNode.removeChild(atoms[3].g);
      if (dragEl) dragEl.setAttribute("transform", "translate(" + c3.x + "," + c3.y + ")");
      if (!dragging) {
        info.innerHTML = "<span class='" + C("big") + "'>" + (zone ? "isobutane" : "butane") + "</span><span class='" + C("big") + "'>" + formula(atoms.concat(hs)) + "</span>" +
          "<span class='" + C("tag") + "'>" + (zone ? "branched chain" : "straight chain") + "</span>";
      }
    }
    function mode4() {
      mode = 4; onOnly(tb, tb[0]); A.reset(); clear(ctl); clear(gZ); clear(gD);
      ui.instr.innerHTML = "✋ Drag the orange-ringed carbon to the other dashed spot.";
      svg.setAttribute("viewBox", "-60 -130 330 210");
      ZONES.forEach(function (z) { z.g = S("circle", { cx: z.x, cy: z.y, r: 24, class: C("zone") }, gZ); });
      zone = 0; c3 = { x: ZONES[0].x, y: ZONES[0].y }; dragging = false;
      dragEl = S("g", { class: C("dragC") }, gD); atomG(dragEl, 0, 0, "C", 17);
      dragEl.addEventListener("pointerdown", startDrag);
      btn(ctl, "🔀 Swap it for me", function () { go(1 - zone); });
      draw4();
      ui.say("<b>Butane</b>: 4 carbons in a row, formula C₄H₁₀. Now drag the end carbon up onto the middle carbon. Will the formula change?");
    }
    function nearZone(maxD) { var best = -1, bd = maxD; ZONES.forEach(function (z, i) { var d = Math.hypot(z.x - c3.x, z.y - c3.y); if (d < bd) { bd = d; best = i; } }); return best; }
    function startDrag(ev) {
      ev.preventDefault(); A.reset();
      var p = pt(svg, ev), off = { x: c3.x - p.x, y: c3.y - p.y }, sx = p.x, sy = p.y, moved = 0;
      dragging = true;
      try { dragEl.setPointerCapture(ev.pointerId); } catch (e) { }
      dragEl.onpointermove = function (e) {
        var q = pt(svg, e); moved = Math.max(moved, Math.hypot(q.x - sx, q.y - sy));
        c3 = { x: Math.max(-40, Math.min(250, q.x + off.x)), y: Math.max(-115, Math.min(60, q.y + off.y)) };
        var nz = nearZone(45); ZONES.forEach(function (z, i) { z.g.classList.toggle(ID + "-near", i === nz); });
        draw4();
      };
      dragEl.onpointerup = dragEl.onpointercancel = function () {
        dragEl.onpointermove = null; dragEl.onpointerup = null;
        ZONES.forEach(function (z) { z.g.classList.remove(ID + "-near"); });
        var nz = moved < 6 ? 1 - zone : nearZone(60);
        go(nz < 0 ? zone : nz);
      };
      draw4();
      ui.say("Drop it on a dashed spot...");
    }
    function go(z) {
      var from = { x: c3.x, y: c3.y }, to = ZONES[z];
      dragging = true;
      A.tween(260, function (t) { c3 = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }; draw4(); }, function () {
        dragging = false; zone = z; c3 = { x: to.x, y: to.y }; draw4();
        if (z === 1) ui.say("🎉 <b>Isobutane</b> (branched butane): the carbon is now a <b>branch</b>. Count the atoms: still C₄H₁₀! Same molecular formula, different structure = <b>structural isomers</b>.", "good");
        else ui.say("<b>Butane</b> again: a straight chain, C₄H₁₀. Butane and isobutane are <b>isomers</b> of each other.", "good");
      });
    }

    /* ---------------- 6 carbons ---------------- */
    var pos6 = [], shape = "chain";
    function chainPos() { var a = []; for (var i = 0; i < 6; i++) a.push({ x: -165 + i * 66, y: 0 }); return a; }
    function ringPos() { var a = []; for (var i = 0; i < 6; i++) { var t = (150 + i * 60) * Math.PI / 180; a.push({ x: 70 * Math.cos(t), y: 70 * Math.sin(t) + 10 }); } return a; }
    function draw6(closed, benz) {
      clear(gM);
      var atoms = pos6.map(function (p) { return { el: "C", x: p.x, y: p.y }; }), bonds = [];
      for (var i = 0; i < 5; i++) bonds.push([i, i + 1, benz && i % 2 === 0 ? 2 : 1]);
      if (closed) bonds.push([5, 0, 1]);
      var hs = drawMol(gM, atoms, bonds, { r: 16, hlen: 30 });
      return formula(atoms.concat(hs));
    }
    function mode6(target, instant) {
      if (mode !== 6) { mode = 6; onOnly(tb, tb[1]); A.reset(); clear(gZ); clear(gD); dragEl = null; clear(ctl); svg.setAttribute("viewBox", "-215 -124 430 248"); pos6 = chainPos(); shape = "chain";
        ui.instr.innerHTML = "👆 Tap a shape to bend the 6-carbon chain into a ring.";
        sb = [["chain", "〰️ Open chain"], ["ring", "⬡ Ring"], ["benzene", "⏣ Benzene"]].map(function (s) { var b = btn(ctl, s[1], function () { mode6(s[0]); }); b.dataset.s = s[0]; return b; });
      }
      onOnly(sb, sb.filter(function (b) { return b.dataset.s === target; })[0]);
      var goal = target === "chain" ? chainPos() : ringPos(), from = pos6.map(function (p) { return { x: p.x, y: p.y }; });
      var needMove = (shape === "chain") !== (target === "chain");
      var finish = function () {
        shape = target; pos6 = goal;
        var f = draw6(target !== "chain", target === "benzene");
        var names = { chain: "hexane", ring: "cyclohexane", benzene: "benzene" };
        info.innerHTML = "<span class='" + C("big") + "'>" + names[target] + "</span><span class='" + C("big") + "'>" + f + "</span><span class='" + C("tag") + "'>" + (target === "chain" ? "open chain" : "ring") + "</span>";
        ui.say({
          chain: "<b>Hexane</b>, C₆H₁₄: six carbons in an open chain. Tap <b>Ring</b> to join its two ends.",
          ring: "<b>Cyclohexane</b>, C₆H₁₂: the ends joined to make a <b>ring</b>. Making the new C–C bond pushed out 2 H atoms (one from each end). Each carbon has 2 H.",
          benzene: "<b>Benzene</b>, C₆H₆: a ring with <b>alternate single and double bonds</b>. The double bonds leave room for only one H on each carbon."
        }[target], target === "chain" ? null : "good");
      };
      if (instant || !needMove) { pos6 = goal; finish(); return; }
      A.tween(700, function (t) { pos6 = from.map(function (p, i) { return { x: p.x + (goal[i].x - p.x) * t, y: p.y + (goal[i].y - p.y) * t }; }); draw6(false, false); }, finish);
    }
    var sb = [];
    btn(ui.bar, "↺ Reset", function () { mode = 0; mode4(); }, "reset");
    mode4();
    return function () { A.stop(); clear(el); };
  };
})();
