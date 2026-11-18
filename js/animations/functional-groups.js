/* Functional groups: clip different groups onto a 3-carbon chain */
(function () {
  "use strict";
  var ID = "functional-groups";
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

  var EXTRA = ".P-hl{fill:var(--accent-2);fill-opacity:.16;stroke:var(--accent-2);stroke-width:2.5;stroke-dasharray:6 4;animation:P-pop .4s ease-out both;transform-box:fill-box;transform-origin:center}" +
    ".P-chips .P-btn{font-family:inherit}.P-fam{background:var(--accent-2);color:#fff;border-color:var(--accent-2)}";
  var B = 70;
  var G = {
    H: { chip: "–H", name: "propane", fam: "alkane", fg: "none (only C and H)", cond: "CH3CH2CH3", add: function () { return { atoms: [], bonds: [], grp: [] }; },
      say: "<b>Propane</b> has only carbon and hydrogen. Now clip on a group made with a <b>heteroatom</b> (an atom other than C and H)." },
    Cl: { chip: "–Cl", name: "chloropropane", fam: "haloalkane", fg: "–Cl (chloro)", cond: "CH3CH2CH2Cl", add: function () { return { atoms: [{ el: "Cl", x: 3 * B + 6, y: 0 }], bonds: [[2, 3, 1]], grp: [3] }; },
      say: "Chlorine replaced one H. The <b>chlorine</b> is a heteroatom, and the name gets the prefix <b>chloro-</b>: chloropropane." },
    Br: { chip: "–Br", name: "bromopropane", fam: "haloalkane", fg: "–Br (bromo)", cond: "CH3CH2CH2Br", add: function () { return { atoms: [{ el: "Br", x: 3 * B + 6, y: 0 }], bonds: [[2, 3, 1]], grp: [3] }; },
      say: "Bromine, a halogen like chlorine, replaced one H: <b>bromopropane</b>. Halogens give the prefix chloro- or bromo-." },
    OH: { chip: "–OH", name: "propanol", fam: "alcohol", fg: "–OH (alcohol)", cond: "CH3CH2CH2OH", add: function () { return { atoms: [{ el: "O", x: 3 * B, y: 0 }], bonds: [[2, 3, 1]], grp: [3] }; },
      say: "The <b>–OH</b> group makes an <b>alcohol</b>. Name ending: <b>-ol</b>, so propane becomes propanol." },
    CHO: { chip: "–CHO", name: "propanal", fam: "aldehyde", fg: "–CHO (aldehyde)", cond: "CH3CH2CHO", add: function () { return { atoms: [{ el: "O", x: 2 * B, y: -62 }], bonds: [[2, 3, 2]], grp: [2, 3] }; },
      say: "The end carbon now has a <b>double bond to O</b> and one H: that is <b>–CHO</b>, an <b>aldehyde</b>. Name ending: <b>-al</b>, so propanal." },
    CO: { chip: ">C=O", name: "propanone", fam: "ketone", fg: ">C=O (ketone)", cond: "CH3COCH3", add: function () { return { atoms: [{ el: "O", x: B, y: -62 }], bonds: [[1, 3, 2]], grp: [1, 3] }; },
      say: "A <b>C=O in the middle</b> of the chain is a <b>ketone</b>. Name ending: <b>-one</b>, so propanone (also called acetone, used in nail-polish remover)." },
    COOH: { chip: "–COOH", name: "propanoic acid", fam: "carboxylic acid", fg: "–COOH (carboxylic acid)", cond: "CH3CH2COOH", add: function () { return { atoms: [{ el: "O", x: 2 * B, y: -62 }, { el: "O", x: 3 * B, y: 0 }], bonds: [[2, 3, 2], [2, 4, 1]], grp: [2, 3, 4] }; },
      say: "<b>–COOH</b>: a C=O and an –OH on the same carbon. That makes a <b>carboxylic acid</b>. Name ending: <b>-oic acid</b>, so propanoic acid." }
  };

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "👆 Tap a group to clip it onto the carbon chain.");
    var chips = H("div", C("row chips"), ui.stage), cb = [];
    Object.keys(G).forEach(function (k) { var b = btn(chips, G[k].chip, function () { set(k); }); b.dataset.k = k; cb.push(b); });
    var info = H("div", C("info"), ui.stage);
    var svg = S("svg", { viewBox: "-60 -110 345 190", role: "img", "aria-label": "Molecule with functional group" }, ui.stage);
    var gH = S("g", null, svg), gM = S("g", null, svg);
    var info2 = H("div", C("info"), ui.stage);

    function set(k) {
      var g = G[k];
      onOnly(cb, cb.filter(function (b) { return b.dataset.k === k; })[0]);
      clear(gH); clear(gM);
      var atoms = [{ el: "C", x: 0, y: 0 }, { el: "C", x: B, y: 0 }, { el: "C", x: 2 * B, y: 0 }], bonds = [[0, 1, 1], [1, 2, 1]];
      var x = g.add();
      atoms = atoms.concat(x.atoms); bonds = bonds.concat(x.bonds);
      x.grp.forEach(function (i) { atoms[i].cls = C("popin"); atoms[i].hcls = C("popin"); });
      var hs = drawMol(gM, atoms, bonds, { r: 17, hlen: 33 });
      if (x.grp.length) {
        var pts = x.grp.map(function (i) { return atoms[i]; }).concat(hs.filter(function (h) { return x.grp.indexOf(h.p) >= 0; }));
        var x0 = Math.min.apply(null, pts.map(function (p) { return p.x; })) - 24, x1 = Math.max.apply(null, pts.map(function (p) { return p.x; })) + 24;
        var y0 = Math.min.apply(null, pts.map(function (p) { return p.y; })) - 24, y1 = Math.max.apply(null, pts.map(function (p) { return p.y; })) + 24;
        S("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 18, class: C("hl") }, gH);
      }
      info.innerHTML = "<span class='" + C("big") + "'>" + g.name + "</span><span class='" + C("tag") + " " + C("fam") + "'>" + g.fam + "</span>";
      info2.innerHTML = "<span class='" + C("tag") + "'>formula: " + sub(g.cond) + "</span><span class='" + C("tag") + "'>molecular: " + formula(atoms.concat(hs)) + "</span><span class='" + C("tag") + "'>functional group: " + g.fg + "</span>";
      ui.say(g.say + (k !== "H" ? " The orange box shows the <b>functional group</b>: it decides how the compound behaves, whatever the chain length." : ""), k === "H" ? null : "good");
    }
    btn(ui.bar, "↺ Reset", function () { set("H"); }, "reset");
    set("H");
    return function () { clear(el); };
  };
})();
