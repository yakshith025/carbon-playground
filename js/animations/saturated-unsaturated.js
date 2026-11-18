/* Saturated vs unsaturated: switch the C–C bond between single, double, triple */
(function () {
  "use strict";
  var ID = "saturated-unsaturated";
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

  var EXTRA = ".P-arm{transition:transform .6s cubic-bezier(.5,1.5,.5,1),opacity .5s}.P-armin{transition:transform .6s cubic-bezier(.5,1.5,.5,1)}" +
    ".P-bondhit{cursor:pointer}.P-bondhit:hover+g line,.P-bondhit:hover{stroke-opacity:.12}" +
    ".P-sat{background:var(--good);color:#fff;border-color:var(--good)}.P-unsat{background:var(--accent-2);color:#fff;border-color:var(--accent-2)}";
  var STEM = ["eth", "prop", "but"], END = ["ane", "ene", "yne"], FAM = ["alkane", "alkene", "alkyne"], GEN = ["C<sub>n</sub>H<sub>2n+2</sub>", "C<sub>n</sub>H<sub>2n</sub>", "C<sub>n</sub>H<sub>2n−2</sub>"];
  var D = 80, L = 38;

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "👆 Tap single, double or triple bond (or tap the red bond) and watch the hydrogens.");
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "-70 -75 220 150", role: "img", "aria-label": "Hydrocarbon molecule" }, ui.stage);
    var gArms = S("g", null, svg), gBond = S("g", null, svg), gC = S("g", null, svg);
    var r1 = H("div", C("row"), ui.stage), r2 = H("div", C("row"), ui.stage), kb = [], nb = [];
    H("span", null, r1, "Bond:");
    ["Single C–C", "Double C=C", "Triple C≡C"].forEach(function (t, i) { kb.push(btn(r1, t, function () { set(n, i + 1); })); });
    H("span", null, r2, "Carbons:");
    [2, 3, 4].forEach(function (m) { nb.push(btn(r2, m + " C", function () { set(m, k); })); });
    var n = 2, k = 1, arms = {};

    function mkArm(key, h, cx, cy) {
      var g = S("g", { class: C("arm") }, gArms);
      S("line", { x1: 0, y1: 0, x2: L, y2: 0, stroke: "var(--ink)", "stroke-width": 3, "stroke-linecap": "round" }, g);
      var inner = S("g", { class: C("armin") }, g);
      atomG(inner, 0, 0, "H", 12);
      var a = { g: g, inner: inner, ang: h.ang, cx: cx, cy: cy };
      g.style.opacity = "0"; place(a, L * 2.4);
      void g.getBoundingClientRect();
      g.style.opacity = "1"; place(a, L);
      arms[key] = a;
    }
    function place(a, dist) {
      a.g.style.transform = "translate(" + a.cx + "px," + a.cy + "px) rotate(" + a.ang + "deg)";
      a.inner.style.transform = "translate(" + dist + "px,0px) rotate(" + (-a.ang) + "deg)";
    }
    function set(nn, kk) {
      var grew = nn > n;
      n = nn; k = kk;
      onOnly(kb, kb[k - 1]); onOnly(nb, nb[n - 2]);
      var atoms = [], bonds = [];
      for (var i = 0; i < n; i++) { atoms.push({ el: "C", x: i * D, y: 0 }); if (i) bonds.push([i - 1, i, i === 1 ? k : 1]); }
      var vw = Math.max(380, (n - 1) * D + 140);
      svg.setAttribute("viewBox", ((n - 1) * D / 2 - vw / 2) + " -72 " + vw + " 144");
      // carbons and C–C bonds (static redraw)
      clear(gBond); clear(gC);
      bonds.forEach(function (b, i) {
        bondLines(gBond, atoms[b[0]], atoms[b[1]], b[2], i === 0 ? "var(--bad)" : "var(--ink)", 4);
      });
      var hit = S("rect", { x: 14, y: -18, width: D - 28, height: 36, rx: 10, fill: "var(--bad)", "fill-opacity": 0, class: C("bondhit") }, gBond);
      hit.addEventListener("click", function () { set(n, k % 3 + 1); });
      atoms.forEach(function (a, i) { atomG(gC, a.x, a.y, "C", 19, grew && i === n - 1 ? C("popin") : null); });
      // hydrogens on swinging arms
      var hs = fillH(atoms, bonds, L), seen = {};
      hs.forEach(function (h) {
        var key = h.p + ":" + h.k, a = arms[key]; seen[key] = 1;
        if (a) { var d = ((h.ang - a.ang) % 360 + 540) % 360 - 180; a.ang += d; place(a, L); }
        else mkArm(key, h, atoms[h.p].x, atoms[h.p].y);
      });
      var lost = 0;
      Object.keys(arms).forEach(function (key) {
        if (seen[key]) return;
        var a = arms[key]; delete arms[key]; lost++;
        a.g.style.opacity = "0"; place(a, L * 2.6);
        setTimeout(function () { if (a.g.parentNode) a.g.parentNode.removeChild(a.g); }, 650);
      });
      var nH = hs.length, name = STEM[n - 2] + END[k - 1];
      info.innerHTML = "<span class='" + C("big") + "'>" + name + "</span><span class='" + C("big") + "'>C<sub>" + n + "</sub>H<sub>" + nH + "</sub></span>" +
        "<span class='" + C("tag") + " " + C(k === 1 ? "sat" : "unsat") + "'>" + (k === 1 ? "saturated" : "unsaturated") + "</span>" +
        "<span class='" + C("tag") + "'>" + FAM[k - 1] + ": " + GEN[k - 1] + "</span>";
      var msg = [
        "<b>Single bonds only.</b> Every carbon holds as many H atoms as it can, so " + name + " is <b>saturated</b>. Alkanes follow C<sub>n</sub>H<sub>2n+2</sub>.",
        "<b>Double bond!</b> The two carbons now use 2 of their 4 bonds on each other, so 2 H atoms had to leave. " + name.charAt(0).toUpperCase() + name.slice(1) + " is <b>unsaturated</b> (an alkene, C<sub>n</sub>H<sub>2n</sub>).",
        "<b>Triple bond!</b> 3 bonds between the carbons leave room for even fewer H: 4 fewer than the alkane. " + name.charAt(0).toUpperCase() + name.slice(1) + " is an <b>alkyne</b>, C<sub>n</sub>H<sub>2n−2</sub>. Unsaturated compounds are more reactive."
      ][k - 1];
      ui.say(msg, k === 1 ? "good" : null);
    }
    function reset() { A.reset(); Object.keys(arms).forEach(function (key) { var a = arms[key]; if (a.g.parentNode) a.g.parentNode.removeChild(a.g); }); arms = {}; n = 2; set(2, 1); }
    btn(ui.bar, "↺ Reset", reset, "reset");
    reset();
    return function () { A.stop(); clear(el); };
  };
})();
