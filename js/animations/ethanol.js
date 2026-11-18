/* Ethanol: reaction with sodium (H2 pop test) and dehydration with hot conc. H2SO4 */
(function () {
  "use strict";
  var ID = "ethanol";
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

  var EXTRA = ".P-na{cursor:grab}.P-na:active{cursor:grabbing}.P-pop{animation:P-boom .7s ease-out forwards;transform-box:fill-box;transform-origin:center}@keyframes P-boom{0%{transform:scale(.2);opacity:1}100%{transform:scale(1.6);opacity:0}}" +
    ".P-eq{font-weight:700;padding:8px 12px;border-radius:12px;border:2px dashed var(--line);margin-top:8px;font-size:14px;text-align:center}" +
    ".P-heat{touch-action:none;-webkit-touch-callout:none}.P-heat.P-on{background:var(--bad);border-color:var(--bad)}.P-mol{margin-top:8px;border:2px solid var(--line);border-radius:14px}";
  function tube(g, x, top, bot, w) { return S("path", { d: "M" + (x - w) + "," + top + " V" + bot + " A" + w + "," + w + " 0 0 0 " + (x + w) + "," + bot + " V" + top, fill: "none", stroke: "var(--ink)", "stroke-width": 2.5, "stroke-opacity": .6 }, g); }
  function liquid(svg, x, y, bot, w, col) {
    var id = ID + "-c" + Math.random().toString(36).slice(2, 7);
    S("path", { d: "M" + (x - w) + "," + (y - 200) + " V" + bot + " A" + w + "," + w + " 0 0 0 " + (x + w) + "," + bot + " V" + (y - 200) + " Z" }, S("clipPath", { id: id }, S("defs", null, svg)));
    return S("rect", { x: x - w - 2, y: y, width: 2 * w + 4, height: bot - y + w + 4, fill: col, "clip-path": "url(#" + id + ")" }, svg);
  }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var A = Anim();
    var ui = shell(el, "");
    var tabs = H("div", C("row"), ui.stage), tb = [];
    tb.push(btn(tabs, "🧪 Ethanol + sodium", function () { sodium(); }));
    tb.push(btn(tabs, "🔥 Heat with conc. H₂SO₄", function () { dehyd(); }));
    var pane = H("div", null, ui.stage), eq = H("div", C("eq"), ui.stage);
    var raf = 0, alive = true, loopFn = null;
    function loop() { if (!alive) return; if (loopFn) loopFn(); raf = requestAnimationFrame(loop); }

    function bubbles(g, list, x, w, yBottom, yTop, rate, opts) {
      if (Math.random() < rate) list.push({ x: x + (Math.random() - .5) * w * 1.4, y: yBottom - Math.random() * 10, r: 2 + Math.random() * 3, e: null });
      return list.filter(function (b) {
        b.y -= 1.3 + b.r * 0.25; b.x += Math.sin(b.y / 7) * 0.3;
        if (!b.e) b.e = S("circle", { r: b.r, fill: "#fff", stroke: "var(--nitrogen)", "stroke-width": 1.2, opacity: .9 }, g);
        if (b.y < yTop) { if (b.e.parentNode) b.e.parentNode.removeChild(b.e); if (opts && opts.out) opts.out(b); return false; }
        b.e.setAttribute("cx", b.x); b.e.setAttribute("cy", b.y); return true;
      });
    }

    /* ---------------- sodium ---------------- */
    function sodium() {
      A.reset(); onOnly(tb, tb[0]); clear(pane); loopFn = null;
      ui.instr.innerHTML = "✋ Drag the sodium into the ethanol, then test the gas with a burning splinter.";
      var svg = S("svg", { viewBox: "0 0 400 270", role: "img", "aria-label": "Sodium in ethanol" }, pane);
      var gB = S("g", null, svg);
      var lq = liquid(svg, 200, 130, 225, 30, "#e7f1ff"); svg.insertBefore(lq, gB);
      tube(svg, 200, 40, 225, 30);
      var tl = S("text", { x: 200, y: 205, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--muted)" }, svg); tl.textContent = "ethanol";
      S("ellipse", { cx: 75, cy: 236, rx: 50, ry: 10, fill: "var(--bg)", stroke: "var(--line)", "stroke-width": 2 }, svg);
      var dl = S("text", { x: 75, y: 262, "text-anchor": "middle", "font-size": 11, fill: "var(--muted)" }, svg); dl.textContent = "sodium (kept under kerosene)";
      var na = S("g", { class: C("na") }, svg), np = { x: 75, y: 222 }, naHit = S("circle", { r: 34, fill: "transparent" }, na), naR = S("rect", { x: -20, y: -14, width: 40, height: 28, rx: 8, fill: "#b0b8c1", stroke: "#7b8590", "stroke-width": 2 }, na);
      var nt = S("text", { "text-anchor": "middle", dy: "0.35em", "font-size": 15, "font-weight": 800, fill: "var(--ink)" }, na); nt.textContent = "Na";
      var gasL = S("text", { x: 200, y: 30, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: "var(--nitrogen)", opacity: 0 }, svg); gasL.textContent = "H₂ gas ↑";
      var spl = S("g", { opacity: 0 }, svg);
      S("rect", { x: 0, y: -3, width: 90, height: 6, rx: 3, fill: "#a1887f" }, spl); var flame = S("text", { x: -10, y: 6, "font-size": 18 }, spl); flame.textContent = "🔥";
      var popG = S("g", null, svg);
      var r = H("div", C("row"), pane); r.style.marginTop = "8px";
      btn(r, "🪵🔥 Bring a burning splinter", test);
      var inTube = false, size = 1, gas = 0, list = [];
      function place() { na.setAttribute("transform", "translate(" + np.x + "," + np.y + ") scale(" + size + ")"); }
      place();
      na.addEventListener("pointerdown", function (ev) {
        if (inTube) return; ev.preventDefault();
        var p = pt(svg, ev), off = { x: np.x - p.x, y: np.y - p.y }, moved = 0, s0 = p;
        try { na.setPointerCapture(ev.pointerId); } catch (e) { }
        na.onpointermove = function (e) { var q = pt(svg, e); moved = Math.max(moved, Math.hypot(q.x - s0.x, q.y - s0.y)); np = { x: q.x + off.x, y: q.y + off.y }; place(); };
        na.onpointerup = na.onpointercancel = function () {
          na.onpointermove = null; na.onpointerup = null;
          if (moved < 6 || (Math.abs(np.x - 200) < 50 && np.y < 200)) drop(); else { np = { x: 75, y: 222 }; place(); }
        };
      });
      function drop() {
        inTube = true; var f = { x: np.x, y: np.y };
        A.tween(500, function (t) { np = { x: f.x + (200 - f.x) * t, y: t < 0.5 ? f.y + (30 - f.y) * t * 2 : 30 + (140 - 30) * (t - 0.5) * 2 }; size = 0.7; place(); }, function () {
          ui.say("🫧 Fizz! Sodium reacts with ethanol and <b>bubbles of gas</b> come off. The sodium slowly gets used up. What is the gas? Test it with a burning splinter.", "good");
          eq.innerHTML = "2Na + 2CH₃CH₂OH → 2CH₃CH₂O⁻Na⁺ + H₂↑<br><span style='font-weight:400;font-size:13px'>sodium ethoxide + hydrogen gas</span>";
          loopFn = function () {
            if (size > 0.05) { size -= 0.0012; np.x = 200 + Math.sin(performance.now() / 120) * 8; place(); gas = Math.min(1, gas + 0.004); }
            else na.setAttribute("opacity", 0);
            list = bubbles(gB, list, 200, 18, np.y, 132, size > 0.05 ? 0.5 : 0);
            gasL.setAttribute("opacity", gas);
          };
        });
      }
      function test() {
        spl.setAttribute("opacity", 1);
        A.tween(600, function (t) { spl.setAttribute("transform", "translate(" + (400 - 180 * t) + ",30) rotate(-15)"); }, function () {
          if (gas > 0.15) {
            var st = S("g", { class: C("pop") }, popG);
            S("path", { d: "M200,20 l8,-18 l4,18 l18,-6 l-12,14 l16,8 l-18,2 l4,18 l-12,-12 l-12,12 l2,-18 l-18,-2 l16,-8 l-12,-14 l18,6 l4,-18 z", fill: "#ffd54f", stroke: "#ff8f00", "stroke-width": 2 }, st);
            var pt2 = S("text", { x: 200, y: 26, "text-anchor": "middle", "font-size": 14, "font-weight": 900, fill: "var(--bad)" }, st); pt2.textContent = "POP!";
            A.later(800, function () { clear(popG); });
            gas = 0.05;
            ui.say("💥 <b>POP!</b> The gas burns with a pop sound. That is the test for <b>hydrogen</b>. Alcohols react with sodium to give hydrogen (and sodium ethoxide).", "good");
          } else ui.say(inTube ? "Not enough gas yet. Wait for more bubbles, then try again." : "No gas here yet: nothing is reacting. Put the sodium into the ethanol first!", "bad");
          A.later(700, function () { spl.setAttribute("opacity", 0); });
        });
      }
      eq.innerHTML = "Ethanol: a liquid at room temperature that mixes with water in all proportions.";
      ui.say("Your teacher shows this one: a small piece of <b>sodium</b> (about the size of two rice grains) is dropped into pure ethanol. Drag it in!");
    }

    /* ---------------- dehydration ---------------- */
    function dehyd() {
      A.reset(); onOnly(tb, tb[1]); clear(pane); loopFn = null;
      ui.instr.innerHTML = "🔥 Press and hold the Heat button until the thermometer reaches 443 K.";
      var svg = S("svg", { viewBox: "0 0 400 260", role: "img", "aria-label": "Heating ethanol with sulphuric acid" }, pane);
      var gB = S("g", null, svg);
      var lq = liquid(svg, 120, 140, 215, 28, "#fff6d6"); svg.insertBefore(lq, gB);
      tube(svg, 120, 50, 215, 28);
      var tl = S("text", { x: 120, y: 190, "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: "var(--muted)" }, svg); tl.textContent = "ethanol + conc. H₂SO₄";
      S("path", { d: "M120,50 V30 H300 V120", fill: "none", stroke: "var(--muted)", "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      S("rect", { x: 262, y: 110, width: 76, height: 120, rx: 10, fill: "var(--bg)", stroke: "var(--muted)", "stroke-width": 2.5 }, svg);
      var jar = S("rect", { x: 264, y: 228, width: 72, height: 0, rx: 8, fill: "var(--accent)", opacity: .25 }, svg);
      var jl = S("text", { x: 300, y: 250, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--muted)" }, svg); jl.textContent = "ethene collected";
      var fire = S("text", { x: 120, y: 252, "text-anchor": "middle", "font-size": 22, opacity: 0 }, svg); fire.textContent = "🔥";
      // thermometer
      S("rect", { x: 186, y: 60, width: 14, height: 150, rx: 7, fill: "var(--card)", stroke: "var(--muted)", "stroke-width": 2 }, svg);
      S("circle", { cx: 193, cy: 216, r: 11, fill: "var(--bad)" }, svg);
      var merc = S("rect", { x: 190, y: 200, width: 8, height: 10, rx: 4, fill: "var(--bad)" }, svg);
      var mark = S("line", { x1: 180, x2: 206, stroke: "var(--good)", "stroke-width": 2, "stroke-dasharray": "3 2" }, svg);
      var ml = S("text", { x: 210, y: 0, "font-size": 10, "font-weight": 700, fill: "var(--good)" }, svg); ml.textContent = "443 K";
      var tt = S("text", { x: 193, y: 52, "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: "var(--ink)" }, svg);
      function yOf(T) { return 205 - (T - 290) / (480 - 290) * 140; }
      mark.setAttribute("y1", yOf(443)); mark.setAttribute("y2", yOf(443)); ml.setAttribute("y", yOf(443) + 4);
      var r = H("div", C("row"), pane); r.style.marginTop = "8px";
      var heat = btn(r, "🔥 Hold to heat", function () { }, "heat");
      var molSvg = S("svg", { viewBox: "-60 -70 340 140", class: C("mol"), role: "img", "aria-label": "Ethanol to ethene" }, pane), gM = S("g", null, molSvg);
      var T = 298, heating = false, list = [], made = 0, morphed = false, zone = -1, travel = [];
      function on(e) { e.preventDefault(); heating = true; heat.classList.add(ID + "-on"); try { heat.setPointerCapture(e.pointerId); } catch (x) { } }
      function off() { heating = false; heat.classList.remove(ID + "-on"); }
      heat.addEventListener("pointerdown", on); heat.addEventListener("pointerup", off); heat.addEventListener("pointercancel", off); heat.addEventListener("pointerleave", off);
      heat.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { heating = true; heat.classList.add(ID + "-on"); } });
      heat.addEventListener("keyup", off);
      heat.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      function ethanolMol() {
        clear(gM);
        var atoms = [{ el: "C", x: 0, y: 0 }, { el: "C", x: 70, y: 0 }, { el: "O", x: 140, y: 0 }], bonds = [[0, 1, 1], [1, 2, 1]];
        var hs = drawMol(gM, atoms, bonds, { r: 15, hlen: 30 });
        var hC = hs.filter(function (h) { return h.p === 0 && h.ang === 90; })[0] || hs[0], hO = hs.filter(function (h) { return h.p === 2; })[0];
        [hC, atoms[2], hO].forEach(function (q) { S("circle", { cx: q.x, cy: q.y, r: 19, fill: "none", stroke: "var(--bad)", "stroke-width": 2, "stroke-dasharray": "4 3" }, gM); });
        var l = S("text", { x: 110, y: 62, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "var(--ink)" }, gM); l.textContent = "Ethanol: the circled H and OH will leave";
        return { hC: hC, O: atoms[2], hO: hO };
      }
      var parts = ethanolMol();
      function morph() {
        clear(gM);
        drawMol(gM, [{ el: "C", x: 0, y: 0 }, { el: "C", x: 70, y: 0 }], [[0, 1, 2]], { r: 15, hlen: 30 });
        var w = [{ el: "H", s: parts.hC, f: { x: 200, y: 20 } }, { el: "O", s: parts.O, f: { x: 225, y: 0 } }, { el: "H", s: parts.hO, f: { x: 250, y: 20 } }].map(function (q) { q.g = atomG(gM, q.s.x, q.s.y, q.el, q.el === "H" ? 10.5 : 15); return q; });
        A.tween(800, function (t) { w.forEach(function (q) { q.g.setAttribute("transform", "translate(" + (q.s.x + (q.f.x - q.s.x) * t) + "," + (q.s.y + (q.f.y - q.s.y) * t) + ")"); }); }, function () {
          var l = S("text", { x: 110, y: 62, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "var(--ink)" }, gM); l.textContent = "Ethene CH₂=CH₂  +  H₂O (to the acid)";
        });
      }
      loopFn = function () {
        T += heating ? 1.1 : -0.35; T = Math.max(298, Math.min(478, T));
        merc.setAttribute("y", yOf(T)); merc.setAttribute("height", 212 - yOf(T));
        tt.textContent = Math.round(T) + " K (" + Math.round(T - 273) + " °C)";
        fire.setAttribute("opacity", heating ? 1 : 0);
        var hot = T >= 443;
        list = bubbles(gB, list, 120, 16, 205, 142, hot ? 0.35 : heating ? 0.03 : 0, { out: function () { travel.push({ p: 0, e: S("circle", { r: 3.5, fill: "var(--accent)" }, svg) }); } });
        travel = travel.filter(function (b) {
          b.p += 0.012; var L1 = 20, L2 = 180, L3 = 90, d = b.p * (L1 + L2 + L3), x, y;
          if (d < L1) { x = 120; y = 50 - d; } else if (d < L1 + L2) { x = 120 + (d - L1); y = 30; } else { x = 300; y = 30 + (d - L1 - L2); }
          b.e.setAttribute("cx", x); b.e.setAttribute("cy", y);
          if (b.p >= 1) { b.e.parentNode.removeChild(b.e); made = Math.min(100, made + 1); jar.setAttribute("height", made * 1.15); jar.setAttribute("y", 228 - made * 1.15); return false; }
          return true;
        });
        var z = hot ? 2 : T > 330 ? 1 : 0;
        if (z !== zone) {
          zone = z;
          if (z === 0) ui.say("The tube has ethanol with <b>excess concentrated sulphuric acid</b>. Hold the heat button to warm it up.");
          if (z === 1) ui.say("Getting hotter... nothing much yet. The reaction needs <b>443 K</b> (170 °C). Keep holding!");
          if (z === 2) { ui.say("🫧 At 443 K, gas bubbles out: it is <b>ethene</b>! Hot conc. H₂SO₄ is a <b>dehydrating agent</b>: it pulls a water molecule (H + OH) out of each ethanol.", "good"); if (!morphed) { morphed = true; morph(); } }
        }
      };
      eq.innerHTML = "CH₃CH₂OH —(hot conc. H₂SO₄, 443 K)→ CH₂=CH₂ + H₂O";
    }

    btn(ui.bar, "↺ Reset", function () { sodium(); }, "reset");
    sodium(); loop();
    return function () { alive = false; cancelAnimationFrame(raf); A.stop(); clear(el); };
  };
})();
