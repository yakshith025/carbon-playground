/* Homologous series: add –CH2– units; watch mass and boiling point climb */
(function () {
  "use strict";
  var ID = "homologous-series";
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

  var EXTRA = ".P-float{animation:P-up 1.3s ease-out forwards}@keyframes P-up{0%{opacity:0;transform:translateY(10px)}20%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}" +
    ".P-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}" +
    ".P-tbl{width:100%;border-collapse:collapse;font-size:13px}.P-tbl th,.P-tbl td{padding:4px 6px;border-bottom:1px solid var(--line);text-align:left}.P-tbl th{color:var(--muted);font-weight:700}" +
    ".P-tbl tr.P-new td{background:var(--bg);font-weight:700}.P-bar{transition:height .5s,y .5s}.P-box{border:2px solid var(--line);border-radius:14px;padding:8px;overflow-x:auto}";
  var NAMES = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct"];
  var DATA = {
    alkane: { bp: [-162, -89, -42, -1, 36, 69, 98, 126], end: "ane", f: function (n) { return "C" + (n > 1 ? "<sub>" + n + "</sub>" : "") + "H<sub>" + (2 * n + 2) + "</sub>"; }, m: function (n) { return 14 * n + 2; } },
    alcohol: { bp: [65, 78, 97, 118, 138, 157, 176, 195], end: "anol", f: function (n) { return "C" + (n > 1 ? "<sub>" + n + "</sub>" : "") + "H<sub>" + (2 * n + 1) + "</sub>OH"; }, m: function (n) { return 14 * n + 18; } }
  };

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "➕ Tap “Add –CH₂–” to grow the next member of the family.");
    var r1 = H("div", C("row"), ui.stage), fb = [];
    H("span", null, r1, "Family:");
    fb.push(btn(r1, "Alkanes", function () { fam = "alkane"; n = 1; draw(false); }));
    fb.push(btn(r1, "Alcohols (–OH)", function () { fam = "alcohol"; n = 1; draw(false); }));
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "0 0 300 150", role: "img", "aria-label": "Molecule" }, ui.stage), gM = S("g", null, svg);
    var r2 = H("div", C("row"), ui.stage);
    var addB = btn(r2, "➕ Add –CH₂–", function () { if (n < 8) { n++; draw(true); } });
    var remB = btn(r2, "➖ Remove –CH₂–", function () { if (n > 1) { n--; draw(false); } });
    var grid = H("div", C("grid"), ui.stage);
    var chartBox = H("div", C("box"), grid), tblBox = H("div", C("box"), grid);
    var chart = S("svg", { viewBox: "0 0 300 200", role: "img", "aria-label": "Boiling point chart" }, chartBox);
    var fam = "alkane", n = 1;

    function drawChart() {
      clear(chart);
      var d = DATA[fam], y0 = 110, k = 0.42; // 0 °C at y0, 0.42 px per °C
      var t = S("text", { x: 6, y: 14, "font-size": 12, "font-weight": 700, fill: "var(--ink)" }, chart); t.textContent = "Boiling point (°C)";
      S("line", { x1: 30, y1: y0, x2: 296, y2: y0, stroke: "var(--muted)", "stroke-width": 1.5 }, chart);
      var z = S("text", { x: 26, y: y0 + 4, "text-anchor": "end", "font-size": 10, fill: "var(--muted)" }, chart); z.textContent = "0";
      var ry = y0 - 25 * k;
      S("line", { x1: 30, y1: ry, x2: 296, y2: ry, stroke: "var(--accent)", "stroke-dasharray": "4 4" }, chart);
      var rt = S("text", { x: 296, y: ry - 4, "text-anchor": "end", "font-size": 10, fill: "var(--accent)" }, chart); rt.textContent = "room temp 25 °C";
      d.bp.forEach(function (bp, i) {
        var x = 38 + i * 32, h = Math.abs(bp) * k, y = bp >= 0 ? y0 - h : y0, on = i < n;
        S("rect", { x: x, y: y, width: 22, height: Math.max(1, h), rx: 5, class: C("bar") + (on && i === n - 1 ? " " + C("popin") : ""), fill: on ? (bp >= 25 ? "var(--accent)" : "var(--accent-2)") : "none", stroke: on ? "none" : "var(--line)", "stroke-dasharray": on ? "" : "3 3" }, chart);
        var lab = S("text", { x: x + 11, y: 196, "text-anchor": "middle", "font-size": 10, fill: "var(--muted)" }, chart); lab.textContent = "C" + (i + 1);
        var v = S("text", { x: x + 11, y: bp >= 0 ? y - 3 : y + h + 11, "text-anchor": "middle", "font-size": 9, "font-weight": 700, fill: on ? "var(--ink)" : "var(--muted)" }, chart); v.textContent = on ? bp : "?";
      });
    }
    function draw(grew) {
      onOnly(fb, fb[fam === "alkane" ? 0 : 1]);
      clear(gM);
      var atoms = [], bonds = [];
      for (var i = 0; i < n; i++) { atoms.push({ el: "C", x: i * 66, y: 0, cls: grew && i === n - 1 ? C("popin") : null, hcls: grew && i === n - 1 ? C("popin") : null }); if (i) bonds.push([i - 1, i, 1]); }
      if (fam === "alcohol") { atoms.push({ el: "O", x: n * 66 - 6, y: 0 }); bonds.push([n - 1, n, 1]); }
      drawMol(gM, atoms, bonds, { r: 15, hlen: 30 });
      fitView(svg, gM, 26, 240, 120);
      var d = DATA[fam], name = NAMES[n - 1] + d.end, bp = d.bp[n - 1];
      if (grew) {
        var vb = svg.viewBox.baseVal, ft = S("text", { x: (n - 1) * 66, y: -44, "text-anchor": "middle", "font-size": 15, "font-weight": 800, fill: "var(--accent-2)", class: C("float") }, gM);
        ft.textContent = "+CH₂  +14 u";
      }
      info.innerHTML = "<span class='" + C("big") + "'>" + name + "</span><span class='" + C("big") + "'>" + d.f(n) + "</span><span class='" + C("tag") + "'>mass " + d.m(n) + " u</span><span class='" + C("tag") + "'>boils at " + bp + " °C</span><span class='" + C("tag") + "'>" + (bp < 25 ? "gas 💨" : "liquid 💧") + " at room temp</span>";
      var rows = "<table class='" + C("tbl") + "'><tr><th>Name</th><th>Formula</th><th>Mass</th><th>b.p.</th></tr>";
      for (var j = 0; j < n; j++) rows += "<tr" + (j === n - 1 ? " class='" + C("new") + "'" : "") + "><td>" + NAMES[j] + d.end + "</td><td>" + d.f(j + 1) + "</td><td>" + d.m(j + 1) + " u</td><td>" + d.bp[j] + " °C</td></tr>";
      tblBox.innerHTML = rows + "</table>";
      drawChart();
      addB.disabled = n >= 8; remB.disabled = n <= 1;
      if (grew) ui.say("Added one <b>–CH₂–</b> unit! " + name.charAt(0).toUpperCase() + name.slice(1) + " is 14 u heavier than " + NAMES[n - 2] + d.end + " and boils at a <b>higher</b> temperature (" + d.bp[n - 2] + " → " + bp + " °C). Its chemical properties stay similar: same family, same " + (fam === "alkane" ? "C–H bonds" : "–OH group") + ".", "good");
      else ui.say(n === 1 ? "Start of the " + (fam === "alkane" ? "<b>alkane</b>" : "<b>alcohol</b>") + " family: <b>" + name + "</b>. Each next member has one more –CH₂– unit. Can you guess the next boiling point (the ? bars)?" : "Now showing <b>" + name + "</b>.");
    }
    btn(ui.bar, "↺ Reset", function () { A.reset(); fam = "alkane"; n = 1; draw(false); }, "reset");
    draw(false);
    return function () { A.stop(); clear(el); };
  };
})();
