/* Allotropes: rotate diamond / graphite / C-60 in 3-D */
(function () {
  "use strict";
  var ID = "allotropes";
  function H(t, c, p, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; if (p) p.appendChild(e); return e; }
  function C(n) { return n.split(" ").map(function (x) { return ID + "-" + x; }).join(" "); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
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

  var EXTRA = ".P-canvas{display:block;width:100%;border-radius:16px;background:radial-gradient(circle at 50% 40%,var(--card),var(--bg));touch-action:none;cursor:grab;border:2px solid var(--line)}.P-canvas:active{cursor:grabbing}" +
    ".P-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-top:10px}.P-card{border:2px solid var(--line);border-radius:14px;padding:8px 10px;background:var(--card);animation:P-pop .35s ease-out both}.P-card b{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.P-card span{font-size:14px;font-weight:600}" +
    ".P-hint{position:absolute;right:10px;top:8px;font-size:12px;color:var(--muted);pointer-events:none}";

  /* ---- structure generators (unit size: max radius = 1) ---- */
  function norm(atoms) {
    var cx = 0, cy = 0, cz = 0; atoms.forEach(function (a) { cx += a[0]; cy += a[1]; cz += a[2]; });
    cx /= atoms.length; cy /= atoms.length; cz /= atoms.length;
    var m = 0; atoms.forEach(function (a) { a[0] -= cx; a[1] -= cy; a[2] -= cz; m = Math.max(m, Math.hypot(a[0], a[1], a[2])); });
    atoms.forEach(function (a) { a[0] /= m; a[1] /= m; a[2] /= m; });
    return m;
  }
  function bondsBy(atoms, d, tol, sameLayer) {
    var b = [];
    for (var i = 0; i < atoms.length; i++) for (var j = i + 1; j < atoms.length; j++) {
      if (sameLayer && atoms[i][3] !== atoms[j][3]) continue;
      var r = Math.hypot(atoms[i][0] - atoms[j][0], atoms[i][1] - atoms[j][1], atoms[i][2] - atoms[j][2]);
      if (Math.abs(r - d) < tol) b.push([i, j]);
    }
    return b;
  }
  function prune(atoms, d, tol, sameLayer, minB) {
    for (var it = 0; it < 6; it++) {
      var b = bondsBy(atoms, d, tol, sameLayer), cnt = atoms.map(function () { return 0; });
      b.forEach(function (x) { cnt[x[0]]++; cnt[x[1]]++; });
      var keep = atoms.filter(function (a, i) { return cnt[i] >= minB; });
      if (keep.length === atoms.length) break;
      atoms = keep;
    }
    return atoms;
  }
  function diamond() {
    var basis = [[0, 0, 0], [0, .5, .5], [.5, 0, .5], [.5, .5, 0]], at = [];
    for (var i = -1; i <= 2; i++) for (var j = -1; j <= 2; j++) for (var k = -1; k <= 2; k++) basis.forEach(function (b) {
      [[0, 0, 0], [.25, .25, .25]].forEach(function (s) {
        var p = [i + b[0] + s[0], j + b[1] + s[1], k + b[2] + s[2], 0];
        if (Math.hypot(p[0] - .625, p[1] - .625, p[2] - .625) < 0.95) at.push(p);
      });
    });
    at = prune(at, 0.433, 0.05, false, 2);
    var m = norm(at);
    return { atoms: at, bonds: bondsBy(at, 0.433 / m, 0.05 / m, false), hl: 0 };
  }
  function graphite(slide) {
    var at = [], s3 = Math.sqrt(3);
    [-1, 0, 1].forEach(function (L, li) {
      var layer = [], sh = (li === 1 ? 1 : 0);
      for (var i = -5; i <= 5; i++) for (var j = -5; j <= 5; j++) {
        var x = i * 1.5 + j * 1.5, z = i * s3 / 2 - j * s3 / 2;
        [[x, z], [x + 1, z]].forEach(function (q) { var px = q[0] + sh, pz = q[1]; if (Math.hypot(px - 0.5, pz) < 2.75) layer.push([px, L * 2.4, pz, li]); });
      }
      layer = prune(layer, 1, 0.05, true, 2);
      at = at.concat(layer);
    });
    return { atoms: at, layered: true };
  }
  function c60() {
    var f = (1 + Math.sqrt(5)) / 2, base = [[0, 1, 3 * f], [1, 2 + f, 2 * f], [f, 2, 2 * f + 1]], at = [], seen = {};
    base.forEach(function (b) {
      [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sy) { [-1, 1].forEach(function (sz) {
        var v = [b[0] * sx, b[1] * sy, b[2] * sz];
        [[v[0], v[1], v[2]], [v[1], v[2], v[0]], [v[2], v[0], v[1]]].forEach(function (p) {
          var key = p.map(function (x) { return x.toFixed(3); }).join(",");
          if (!seen[key]) { seen[key] = 1; at.push([p[0], p[1], p[2], 0]); }
        });
      }); }); });
    });
    var m = norm(at);
    return { atoms: at, bonds: bondsBy(at, 2 / m, 0.1 / m, false), hl: -1 };
  }

  var INFO = {
    diamond: { cap: "<b>Diamond</b>: every carbon atom is joined to <b>4</b> other carbon atoms (orange bonds), making a rigid 3-D network. That is why it is the <b>hardest</b> substance known.",
      cards: [["Bonds per C", "4, in a 3-D network"], ["Hard or soft?", "Hardest substance known 💪"], ["Conducts electricity?", "No ❌"], ["Used for", "Cutting tools, jewellery 💍"]] },
    graphite: { cap: "<b>Graphite</b>: each carbon is joined to <b>3</b> others in flat hexagon layers. The layers are stacked loosely, so they can <b>slide</b>. Try the slide button!",
      cards: [["Bonds per C", "3, in flat hexagon layers"], ["Hard or soft?", "Soft and slippery 🧈"], ["Conducts electricity?", "Yes, very well ✅"], ["Used for", "Pencil lead ✏️, lubricant, electrodes"]] },
    fullerene: { cap: "<b>Fullerene C-60</b>: 60 carbon atoms arranged like a <b>football</b> ⚽ made of hexagons and pentagons. Named after architect Buckminster Fuller, whose domes look similar.",
      cards: [["Atoms", "60 carbon atoms"], ["Shape", "Hollow football cage ⚽"], ["Rings", "12 pentagons + 20 hexagons"], ["Fun fact", "Named after Buckminster Fuller"]] }
  };

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "🔄 Pick a form of carbon, then drag the model to spin it.");
    var row = H("div", C("row"), ui.stage), tabs = [], kind = "diamond";
    [["diamond", "💎 Diamond"], ["graphite", "✏️ Graphite"], ["fullerene", "⚽ Fullerene C-60"]].forEach(function (k) { var b = btn(row, k[1], function () { load(k[0]); }); b.dataset.k = k[0]; tabs.push(b); });
    var box = H("div", null, ui.stage); box.style.position = "relative";
    var cv = H("canvas", C("canvas"), box), hint = H("div", C("hint"), box, "drag to rotate"), ctx = cv.getContext("2d");
    var slideRow = H("div", C("row"), ui.stage); slideRow.style.marginTop = "8px";
    var slideBtn = btn(slideRow, "👉 Slide the top layer", function () { slideT = slideT > 0 ? 0 : 1; slideBtn.innerHTML = slideT ? "👈 Slide it back" : "👉 Slide the top layer"; if (slideT) ui.say("See? The layers <b>slide over each other</b> easily. That is why graphite feels slippery and why a pencil leaves a mark on paper.", "good"); });
    var cards = H("div", C("cards"), ui.stage);
    var model, yaw = 0.6, pitch = -0.35, dragging = false, last = null, slide = 0, slideT = 0, W = 300, Hh = 240, raf = 0, alive = true, idle = 0;
    var colC = "#3b4048", colA = "#ff8a3d", colL = "#999";

    function readColors() {
      var cs = getComputedStyle(el);
      colC = (cs.getPropertyValue("--carbon") || "").trim() || colC;
      colA = (cs.getPropertyValue("--accent-2") || "").trim() || colA;
      colL = (cs.getPropertyValue("--muted") || "").trim() || colL;
    }
    function size() {
      var w = box.clientWidth || 300, dpr = window.devicePixelRatio || 1;
      W = w; Hh = Math.round(Math.max(220, Math.min(340, w * 0.62)));
      cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); cv.style.height = Hh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function load(k) {
      kind = k; onOnly(tabs, tabs.filter(function (b) { return b.dataset.k === k; })[0]);
      model = k === "diamond" ? diamond() : k === "graphite" ? graphite() : c60();
      if (k === "graphite") { // keep raw layer coords so we can slide one layer
        var m = norm(model.atoms); model.bonds = bondsBy(model.atoms, 1 / m, 0.05 / m, true); model.unit = 1 / m;
        var bd = 1e9; model.hl = 0;
        model.atoms.forEach(function (a, i) { var d = Math.hypot(a[0], a[2]); if (a[3] === 0 && d < bd) { bd = d; model.hl = i; } });
      } else if (k === "diamond") {
        model.hl = model.atoms.reduce(function (bi, a, i, arr) { return Math.hypot(a[0], a[1], a[2]) < Math.hypot(arr[bi][0], arr[bi][1], arr[bi][2]) ? i : bi; }, 0);
      }
      if (k === "graphite") pitch = -0.5;
      slide = 0; slideT = 0; slideBtn.innerHTML = "👉 Slide the top layer";
      slideRow.style.display = k === "graphite" ? "" : "none";
      clear(cards); INFO[k].cards.forEach(function (c, i) { var d = H("div", C("card"), cards, "<b>" + c[0] + "</b><span>" + c[1] + "</span>"); d.style.animationDelay = i * 0.07 + "s"; });
      ui.say(INFO[k].cap);
    }
    function proj(a) {
      var x = a[0] + (a[3] === 0 && model.layered ? slide * 1.6 * model.unit : 0), y = a[1], z = a[2];
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      var y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      var F = 3.2, s = F / (F + z2), R = Math.min(W, Hh) * 0.4;
      return { x: W / 2 + x1 * R * s, y: Hh / 2 + y2 * R * s, z: z2, s: s };
    }
    function draw() {
      if (!alive) return;
      if (!el.isConnected) { raf = requestAnimationFrame(draw); return; }
      if (!dragging) { idle++; if (idle > 40) yaw += 0.006; }
      slide += (slideT - slide) * 0.08;
      ctx.clearRect(0, 0, W, Hh);
      var P = model.atoms.map(proj), R = Math.min(W, Hh) * 0.4, ar = kind === "fullerene" ? 0.075 : kind === "diamond" ? 0.085 : 0.065;
      var hlB = {};
      model.bonds.forEach(function (b, i) { if (b[0] === model.hl || b[1] === model.hl) hlB[i] = 1; });
      var order = model.bonds.map(function (b, i) { return i; }).sort(function (i, j) { var a = model.bonds[i], b = model.bonds[j]; return (P[b[0]].z + P[b[1]].z) - (P[a[0]].z + P[a[1]].z); });
      ctx.lineCap = "round";
      order.forEach(function (i) {
        var b = model.bonds[i], p = P[b[0]], q = P[b[1]], d = (p.z + q.z) / 2;
        ctx.globalAlpha = Math.max(0.25, Math.min(1, 0.75 - d * 0.5));
        ctx.strokeStyle = hlB[i] ? colA : colL; ctx.lineWidth = (hlB[i] ? 5 : 3) * (p.s + q.s) / 2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      });
      var idx = P.map(function (p, i) { return i; }).sort(function (i, j) { return P[j].z - P[i].z; });
      idx.forEach(function (i) {
        var p = P[i], r = R * ar * p.s;
        ctx.globalAlpha = Math.max(0.35, Math.min(1, 0.85 - p.z * 0.4));
        ctx.fillStyle = i === model.hl ? colA : colC; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.arc(p.x - r * 0.3, p.y - r * 0.35, r * 0.35, 0, 6.2832); ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    cv.addEventListener("pointerdown", function (e) { dragging = true; idle = 0; last = [e.clientX, e.clientY]; hint.style.display = "none"; try { cv.setPointerCapture(e.pointerId); } catch (x) { } e.preventDefault(); });
    cv.addEventListener("pointermove", function (e) { if (!dragging) return; yaw += (e.clientX - last[0]) * 0.012; pitch = Math.max(-1.5, Math.min(1.5, pitch + (e.clientY - last[1]) * 0.012)); last = [e.clientX, e.clientY]; });
    function up() { dragging = false; idle = 0; }
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    var ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { if ((box.clientWidth || 300) !== W) requestAnimationFrame(size); }); ro.observe(box); } else window.addEventListener("resize", size);

    btn(ui.bar, "↺ Reset", function () { yaw = 0.6; pitch = -0.35; hint.style.display = ""; load("diamond"); }, "reset");
    readColors(); size(); load("diamond"); draw();
    return function () { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); else window.removeEventListener("resize", size); clear(el); };
  };
})();
