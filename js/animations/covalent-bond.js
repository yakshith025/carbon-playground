/* Covalent bond: drag atoms together so they share electrons */
(function () {
  "use strict";
  var ID = "covalent-bond";
  var NS = "http://www.w3.org/2000/svg";
  function S(t, a, p) { var e = document.createElementNS(NS, t); if (a) for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function H(t, c, p, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; if (p) p.appendChild(e); return e; }
  function C(n) { return n.split(" ").map(function (x) { return ID + "-" + x; }).join(" "); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function pt(svg, ev) { var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; p = p.matrixTransform(m.inverse()); return { x: p.x, y: p.y }; }
  var BASE = ".P-wrap{color:var(--ink);background:var(--card);border-radius:18px;padding:12px;box-sizing:border-box;width:100%;max-width:760px;margin:0 auto;font-size:15px;line-height:1.45;-webkit-user-select:none;user-select:none}.P-wrap *{box-sizing:border-box}.P-instr{font-weight:700;margin:0 0 10px;padding:6px 12px;border-radius:12px;background:var(--bg);display:inline-block}.P-stage{position:relative;width:100%}.P-stage svg{display:block;width:100%;height:auto;touch-action:none;overflow:visible}.P-cap{min-height:3em;margin-top:10px;padding:10px 14px;border-radius:14px;background:var(--bg);border-left:6px solid var(--accent);transition:border-color .3s}.P-cap.P-good{border-left-color:var(--good)}.P-cap.P-bad{border-left-color:var(--bad)}.P-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}.P-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;align-items:center}.P-btn{appearance:none;-webkit-appearance:none;border:2px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;touch-action:manipulation;transition:transform .15s,background .2s,color .2s,border-color .2s}.P-btn:hover{border-color:var(--accent)}.P-btn:active{transform:scale(.95)}.P-btn.P-on{background:var(--accent);border-color:var(--accent);color:#fff}.P-btn:disabled{opacity:.45;cursor:default}.P-reset{margin-left:auto;background:var(--bg)}@keyframes P-pop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}.P-popin{animation:P-pop .4s ease-out both;transform-box:fill-box;transform-origin:center}@media (max-width:420px){.P-wrap{padding:8px;font-size:14px}.P-btn{padding:6px 10px;font-size:13px}}";
  function injectCSS(extra) { if (document.getElementById(ID + "-css")) return; var s = document.createElement("style"); s.id = ID + "-css"; s.textContent = (BASE + (extra || "")).replace(/P-/g, ID + "-"); document.head.appendChild(s); }
  function shell(el, instr) {
    clear(el);
    var w = H("div", C("wrap"), el), ins = H("div", C("instr"), w, instr), st = H("div", C("stage"), w), cap = H("div", C("cap"), w), bar = H("div", C("btns"), w);
    cap.setAttribute("aria-live", "polite");
    return { wrap: w, instr: ins, stage: st, cap: cap, bar: bar, say: function (h, tone) { cap.innerHTML = h; cap.className = C("cap") + (tone ? " " + C(tone) : ""); } };
  }
  function btn(p, label, fn, cls) { var b = H("button", C("btn" + (cls ? " " + cls : "")), p, label); b.type = "button"; b.addEventListener("click", fn); return b; }
  function onOnly(list, b) { list.forEach(function (x) { x.classList.toggle(ID + "-on", x === b); }); }

  var EXTRA = ".P-atom{cursor:grab}.P-atom:active{cursor:grabbing}.P-fixed{cursor:default}" +
    ".P-pend{animation:P-blink 1s ease-in-out infinite alternate}@keyframes P-blink{from{opacity:1}to{opacity:.35}}" +
    ".P-target{fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:4 5;opacity:.5;transition:opacity .2s}.P-target.P-near{opacity:1;stroke-width:3}" +
    ".P-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--muted);margin-top:4px}.P-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:middle}" +
    ".P-energy{margin-top:12px;padding:10px;border:2px dashed var(--line);border-radius:14px}.P-energy h4{margin:0 0 8px;font-size:15px}" +
    ".P-meter{height:16px;border-radius:999px;background:var(--bg);overflow:hidden;margin:8px 0;border:1px solid var(--line)}.P-meter div{height:100%;width:0;border-radius:999px;transition:width .6s ease,background .4s}" +
    ".P-etext{font-size:14px;min-height:2.8em}";

  var EL = { H: { v: 1, R: 26, full: 2 }, C: { v: 4, R: 38, full: 8 }, N: { v: 5, R: 38, full: 8 }, O: { v: 6, R: 38, full: 8 }, Cl: { v: 7, R: 41, full: 8 } };
  var COL = { H: "var(--hydrogen)", C: "var(--carbon)", N: "var(--nitrogen)", O: "var(--oxygen)", Cl: "var(--chlorine)" };
  var MOLS = {
    H2: { c: "H", p: "H", k: 1, t: [0], cx: 140, start: [[330, 120]], line: "H–H", bond: "a <b>single bond</b> (1 shared pair)", intro: "Each hydrogen has <b>1 electron</b> but wants <b>2</b> (like helium)." },
    Cl2: { c: "Cl", p: "Cl", k: 1, t: [0], cx: 140, start: [[330, 120]], line: "Cl–Cl", bond: "a <b>single bond</b> (1 shared pair)", intro: "Each chlorine has <b>7</b> outer electrons and needs <b>1 more</b> to make 8." },
    O2: { c: "O", p: "O", k: 2, t: [0], cx: 140, start: [[330, 120]], line: "O=O", bond: "a <b>double bond</b> (2 shared pairs)", intro: "Each oxygen has <b>6</b> outer electrons and needs <b>2 more</b>." },
    N2: { c: "N", p: "N", k: 3, t: [0], cx: 140, start: [[330, 120]], line: "N≡N", bond: "a <b>triple bond</b> (3 shared pairs)", intro: "Each nitrogen has <b>5</b> outer electrons and needs <b>3 more</b>." },
    CH4: { c: "C", p: "H", k: 1, t: [0, 90, 180, 270], cx: 200, start: [[45, 40], [355, 40], [45, 220], [355, 220]], line: "4 C–H single bonds", bond: "<b>four single bonds</b>. Carbon is <b>tetravalent</b>", intro: "Carbon has <b>4</b> outer electrons and needs <b>4 more</b>. Each H has 1 and needs 1." },
    H2O: { c: "O", p: "H", k: 1, t: [180, 0], cx: 200, start: [[45, 50], [355, 210]], line: "H–O–H", bond: "<b>two single bonds</b>", intro: "Oxygen has <b>6</b> outer electrons and needs <b>2 more</b>. Each H needs 1." }
  };
  var CY = 125, ECOL = ["var(--accent)", "var(--accent-2)"];
  function rad(d) { return d * Math.PI / 180; }

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "🤏 Pick a molecule, then drag the atoms together (or tap them).");
    var row = H("div", C("row"), ui.stage), molBtns = [], cur = "H2";
    Object.keys(MOLS).forEach(function (k) { var b = btn(row, k.replace(/(\d)/g, "<sub>$1</sub>"), function () { load(k); }); b.dataset.k = k; molBtns.push(b); });
    var svg = S("svg", { viewBox: "0 0 400 272", role: "img", "aria-label": "Atoms sharing electrons" }, ui.stage);
    var gT = S("g", null, svg), gA = S("g", null, svg), gD = S("g", null, svg);
    var formula = S("text", { x: 200, y: 266, "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: "var(--good)" }, svg);
    var leg = H("div", C("legend"), ui.stage, "<span><i style='background:var(--accent)'></i>electrons of the atom that stays still</span><span><i style='background:var(--accent-2)'></i>electrons of the atom you drag</span><span>blinking = ready to share</span>");
    var M, atoms, targets, drag = null, raf = 0;

    function load(k) {
      cur = k; M = MOLS[k];
      molBtns.forEach(function (b) { b.classList.toggle(ID + "-on", b.dataset.k === k); });
      clear(gT); clear(gA); clear(gD); formula.textContent = "";
      var ce = EL[M.c], pe = EL[M.p], D = (ce.R + pe.R) * 0.74;
      atoms = [{ el: M.c, x: M.cx, y: CY, fixed: true }];
      targets = M.t.map(function (a) { return { ang: a, x: M.cx + D * Math.cos(rad(a)), y: CY + D * Math.sin(rad(a)), by: -1 }; });
      targets.forEach(function (t) { t.g = S("circle", { cx: t.x, cy: t.y, r: pe.R, class: C("target") }, gT); });
      M.start.forEach(function (s) { atoms.push({ el: M.p, x: s[0], y: s[1], t: -1 }); });
      atoms.forEach(function (a, i) {
        var e = EL[a.el];
        a.g = S("g", { class: C(a.fixed ? "fixed" : "atom") }, gA);
        S("circle", { r: e.R, fill: COL[a.el], "fill-opacity": a.el === "H" ? 0.55 : 0.16, stroke: a.el === "H" ? "var(--muted)" : COL[a.el], "stroke-width": 2, "stroke-dasharray": "5 4" }, a.g);
        S("circle", { r: a.el === "H" ? 11 : 15, fill: COL[a.el], stroke: "var(--ink)", "stroke-opacity": 0.4 }, a.g);
        var t = S("text", { "text-anchor": "middle", dy: "0.36em", "font-size": a.el === "Cl" ? 13 : 15, "font-weight": 800, fill: a.el === "H" ? "var(--ink)" : "#fff" }, a.g); t.textContent = a.el;
        a.lab = S("text", a.fixed ? { x: -e.R - 4, y: -e.R - 4, "text-anchor": "end", "font-size": 13, "font-weight": 800 } : { y: e.R + 15, "text-anchor": "middle", "font-size": 12, "font-weight": 700 }, a.g);
        if (!a.fixed) a.g.addEventListener("pointerdown", function (ev) { startDrag(ev, i); });
      });
      render();
      ui.say(M.intro + " Drag the " + (M.p === "H" ? "H atoms" : "right atom") + " into a dashed circle so the outer shells overlap and electrons are shared.");
    }

    function count(i) { var a = atoms[i]; var e = EL[a.el]; if (i === 0) { var s = 0; targets.forEach(function (t) { if (t.by >= 0) s += M.k; }); return e.v + s; } return e.v + (a.t >= 0 ? M.k : 0); }
    function dot(x, y, col, pend) { S("circle", { cx: x, cy: y, r: 4.2, fill: col, stroke: "#fff", "stroke-width": 1, class: pend ? C("pend") : "" }, gD); }
    function ringDots(a, ang, n, col, spread, pend) { var R = EL[a.el].R; for (var j = 0; j < n; j++) { var d = ang + (j - (n - 1) / 2) * spread; dot(a.x + R * Math.cos(rad(d)), a.y + R * Math.sin(rad(d)), col, pend); } }
    function pairsOn(a, slots, used, n, col) {
      slots.filter(function (s) { return used.indexOf(((s % 360) + 360) % 360) < 0; }).slice(0, n).forEach(function (s) { ringDots(a, s, 2, col, 20, false); });
    }

    function render() {
      clear(gD);
      atoms.forEach(function (a) { a.g.setAttribute("transform", "translate(" + a.x + "," + a.y + ")"); });
      // centre atom
      var c = atoms[0], ce = EL[c.el], used = [], shared = 0;
      targets.forEach(function (t) {
        used.push(t.ang); shared += M.k;
        if (t.by >= 0) {
          var p = atoms[t.by], ux = Math.cos(rad(t.ang)), uy = Math.sin(rad(t.ang)), mx = (c.x + p.x) / 2, my = (c.y + p.y) / 2;
          for (var i = 0; i < M.k; i++) { var o = (i - (M.k - 1) / 2) * 11; dot(mx - uy * o - ux * 4.5, my + ux * o - uy * 4.5, ECOL[0]); dot(mx - uy * o + ux * 4.5, my + ux * o + uy * 4.5, ECOL[1]); }
        } else ringDots(c, t.ang, M.k, ECOL[0], 24, true);
      });
      pairsOn(c, targets.length === 1 ? [180, 270, 90, 0] : [270, 90, 180, 0], used, (ce.v - shared) / 2, ECOL[0]);
      // partners
      atoms.forEach(function (a, i) {
        if (i === 0) return;
        var e = EL[a.el], ang = a.t >= 0 ? targets[a.t].ang + 180 : Math.atan2(c.y - a.y, c.x - a.x) * 180 / Math.PI;
        if (a.t < 0) ringDots(a, ang, M.k, ECOL[1], 24, true);
        var free = (e.v - M.k) / 2;
        if (free > 0) [ang + 180, ang + 90, ang + 270].slice(0, free).forEach(function (s) { ringDots(a, s, 2, ECOL[1], 20, false); });
      });
      atoms.forEach(function (a, i) {
        var n = count(i), full = EL[a.el].full;
        a.lab.textContent = n + (n === full ? " ✓" : " / " + full);
        a.lab.setAttribute("fill", n === full ? "var(--good)" : "var(--muted)");
      });
      targets.forEach(function (t) { t.g.style.display = t.by >= 0 ? "none" : ""; });
    }

    function nearest(a, maxD) { var best = -1, bd = maxD; targets.forEach(function (t, i) { if (t.by >= 0) return; var d = Math.hypot(t.x - a.x, t.y - a.y); if (d < bd) { bd = d; best = i; } }); return best; }
    function startDrag(ev, i) {
      ev.preventDefault();
      var a = atoms[i], p = pt(svg, ev);
      if (a.t >= 0) { targets[a.t].by = -1; a.t = -1; }
      drag = { i: i, dx: a.x - p.x, dy: a.y - p.y, sx: p.x, sy: p.y, moved: 0 };
      a.g.parentNode.appendChild(a.g);
      try { a.g.setPointerCapture(ev.pointerId); } catch (e) { }
      a.g.onpointermove = function (e2) {
        if (!drag) return; var q = pt(svg, e2);
        drag.moved = Math.max(drag.moved, Math.hypot(q.x - drag.sx, q.y - drag.sy));
        a.x = Math.max(25, Math.min(375, q.x + drag.dx)); a.y = Math.max(25, Math.min(225, q.y + drag.dy));
        var n = nearest(a, 50); targets.forEach(function (t, k) { t.g.classList.toggle(ID + "-near", k === n); });
        render();
      };
      a.g.onpointerup = a.g.onpointercancel = function () {
        if (!drag) return; var tapped = drag.moved < 6; drag = null; a.g.onpointermove = null;
        var n = nearest(a, tapped ? 9999 : 55);
        targets.forEach(function (t) { t.g.classList.remove(ID + "-near"); });
        if (n >= 0) snap(i, n); else { render(); status(); }
      };
      render();
    }
    function snap(i, n) {
      var a = atoms[i], t = targets[n], x0 = a.x, y0 = a.y, t0 = performance.now();
      t.by = i; a.t = n;
      cancelAnimationFrame(raf);
      (function step(now) {
        var f = Math.min(1, (now - t0) / 220); a.x = x0 + (t.x - x0) * f; a.y = y0 + (t.y - y0) * f; render();
        if (f < 1) raf = requestAnimationFrame(step); else status();
      })(t0);
    }
    function status() {
      var done = targets.filter(function (t) { return t.by >= 0; }).length;
      if (done === targets.length) {
        formula.textContent = M.line;
        ui.say("🎉 Every atom now has a full outer shell ✓. The shared electrons count for <b>both</b> atoms. This is " + M.bond + ". Sharing electron pairs = a <b>covalent bond</b>.", "good");
      } else if (done === 0) {
        formula.textContent = "";
        ui.say(M.intro + " The atoms are apart, so nobody has a full shell yet. Drag them together!");
      } else {
        formula.textContent = "";
        ui.say("Good! " + done + " bond" + (done > 1 ? "s" : "") + " made. The central " + M.c + " still has blinking electrons waiting to share. Bring the rest!");
      }
    }

    /* energy meter: why carbon shares */
    var en = H("div", C("energy"), ui.stage);
    H("h4", null, en, "⚡ Why doesn't carbon just gain or lose 4 electrons?");
    var er = H("div", C("row"), en), eb = [];
    var meter = H("div", C("meter"), en), fill = H("div", null, meter), etext = H("div", C("etext"), en, "Carbon (6 protons, electrons 2, 4) has 4 outer electrons. Tap an option to see how hard it is.");
    [["➕ Gain 4 → C⁴⁻", 88, "var(--bad)", "<b>Too hard!</b> 6 protons in the nucleus cannot hold on to 10 electrons."],
     ["➖ Lose 4 → C⁴⁺", 100, "var(--bad)", "<b>Too hard!</b> Removing 4 electrons needs a <b>huge amount of energy</b>, leaving 6 protons with only 2 electrons."],
     ["🤝 Share 4", 18, "var(--good)", "<b>Easy!</b> By <b>sharing</b> its 4 electrons, carbon and its partners all get full shells. That is why carbon forms covalent bonds."]
    ].forEach(function (o) {
      var b = btn(er, o[0], function () { onOnly(eb, b); fill.style.width = o[1] + "%"; fill.style.background = o[2]; etext.innerHTML = o[3]; });
      eb.push(b);
    });
    function resetEnergy() { onOnly(eb, null); fill.style.width = "0"; etext.innerHTML = "Carbon (6 protons, electrons 2, 4) has 4 outer electrons. Tap an option to see how hard it is."; }

    btn(ui.bar, "↺ Reset", function () { resetEnergy(); load(cur); }, "reset");
    load("H2");
    return function () { cancelAnimationFrame(raf); clear(el); };
  };
})();
