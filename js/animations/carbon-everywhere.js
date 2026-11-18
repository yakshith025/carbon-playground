/* Carbon everywhere: find the hidden carbon + conductivity tester */
(function () {
  "use strict";
  var ID = "carbon-everywhere";
  var NS = "http://www.w3.org/2000/svg";
  function S(t, a, p) { var e = document.createElementNS(NS, t); if (a) for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
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

  var EXTRA = ".P-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    ".P-tile{position:relative;border:2px solid var(--line);background:var(--card);border-radius:16px;padding:10px 6px;text-align:center;cursor:pointer;font:inherit;color:var(--ink);min-height:92px;transition:transform .2s,border-color .3s,background .3s;touch-action:manipulation}" +
    ".P-tile:active{transform:scale(.96)}.P-tile .P-emo{font-size:30px;line-height:1.1;display:block;transition:transform .4s}" +
    ".P-tile .P-lab{display:block;font-weight:700;font-size:13px;margin-top:2px}" +
    ".P-tile .P-fact{display:block;font-size:12px;color:var(--muted);max-height:0;overflow:hidden;transition:max-height .4s}" +
    ".P-tile.P-yes{border-color:var(--good)}.P-tile.P-no{border-color:var(--bad)}" +
    ".P-tile.P-yes .P-fact,.P-tile.P-no .P-fact{max-height:80px}" +
    ".P-tile.P-yes .P-emo,.P-tile.P-no .P-emo{transform:scale(.8)}" +
    ".P-badge{position:absolute;top:-8px;right:-6px;border-radius:999px;padding:1px 7px;font-size:12px;font-weight:800;color:#fff;animation:P-pop .4s ease-out both}" +
    ".P-yes .P-badge{background:var(--good)}.P-no .P-badge{background:var(--bad)}" +
    ".P-count{font-weight:700;margin-left:4px}" +
    ".P-wire{fill:none;stroke:var(--ink);stroke-width:3;stroke-linejoin:round}" +
    ".P-flow{fill:none;stroke:#ffc400;stroke-width:3;stroke-dasharray:5 9;opacity:0;transition:opacity .4s}" +
    ".P-live .P-flow{opacity:1;animation:P-dash .6s linear infinite}@keyframes P-dash{to{stroke-dashoffset:-14}}" +
    ".P-bulb{transition:fill .4s}.P-halo{opacity:0;transition:opacity .4s}.P-live .P-halo{opacity:.55}" +
    ".P-liquid{transform-box:fill-box;transform-origin:50% 100%;transition:transform .7s ease,fill .5s}" +
    ".P-ion{animation:P-wander 2.4s ease-in-out infinite alternate}@keyframes P-wander{0%{transform:translate(-10px,4px)}50%{transform:translate(8px,-6px)}100%{transform:translate(-4px,8px)}}";

  var THINGS = [
    { e: "✏️", n: "Pencil lead", c: true, f: "Graphite: pure carbon!" },
    { e: "💍", n: "Diamond ring", c: true, f: "Diamond: pure carbon in a hard 3-D network." },
    { e: "🔥", n: "LPG gas", c: true, f: "Mostly butane, C₄H₁₀: carbon + hydrogen." },
    { e: "⛽", n: "Petrol", c: true, f: "A mixture of hydrocarbons (C and H)." },
    { e: "🍚", n: "Food", c: true, f: "Starch, proteins and fats are carbon compounds." },
    { e: "👕", n: "Cotton shirt", c: true, f: "Cotton is cellulose, long chains of carbon compounds." },
    { e: "🧴", n: "Plastic bottle", c: true, f: "Plastic is a polymer: very long carbon chains." },
    { e: "🧂", n: "Table salt", c: false, f: "NaCl is sodium + chlorine. No carbon here!" },
    { e: "💧", n: "Water", c: false, f: "H₂O is hydrogen + oxygen. No carbon!" }
  ];
  var LIQ = [
    { k: "salt", n: "🧂 Salt water", col: "#cfe8ff", on: true, t: "<b>Bulb glows!</b> Salt (NaCl) is an <b>ionic</b> compound. In water it splits into charged ions (Na⁺ and Cl⁻) that carry the current." },
    { k: "sugar", n: "🍬 Sugar water", col: "#fff3c4", on: false, t: "<b>No glow.</b> Sugar is a <b>covalent</b> carbon compound. Its atoms share electrons, so no ions form to carry current." },
    { k: "kero", n: "🛢️ Kerosene", col: "#ffe0a3", on: false, t: "<b>No glow.</b> Kerosene is made of hydrocarbons, which are <b>covalent</b>. Carbon compounds are poor conductors." },
    { k: "alc", n: "🍶 Alcohol", col: "#eef6ff", on: false, t: "<b>No glow.</b> Ethanol (alcohol) is <b>covalent</b>: no ions. Covalent compounds also have low melting and boiling points (ethanol boils at 351 K)." }
  ];

  (window.ANIMATIONS = window.ANIMATIONS || {})[ID] = function mount(el) {
    injectCSS(EXTRA);
    var ui = shell(el, "");
    var tabs = H("div", C("row"), ui.stage);
    var tA = btn(tabs, "🔍 Find the carbon", function () { show(0); });
    var tB = btn(tabs, "💡 Conductivity test", function () { show(1); });
    var paneA = H("div", null, ui.stage), paneB = H("div", null, ui.stage);
    var found = 0, counter;

    /* ---------- Pane A: tap to reveal ---------- */
    function buildA() {
      clear(paneA); found = 0;
      var top = H("div", C("row"), paneA, "Carbon found:");
      counter = H("span", C("count"), top, "0 / 7");
      var grid = H("div", C("grid"), paneA);
      THINGS.forEach(function (t) {
        var b = H("button", C("tile"), grid);
        b.type = "button";
        H("span", C("emo"), b, t.e); H("span", C("lab"), b, t.n); H("span", C("fact"), b, t.f);
        b.addEventListener("click", function () {
          if (b.dataset.done) { return; }
          b.dataset.done = "1";
          b.classList.add(ID + (t.c ? "-yes" : "-no"));
          H("span", C("badge"), b, t.c ? "C ✓" : "no C");
          if (t.c) {
            found++; counter.textContent = found + " / 7";
            if (found === 7) ui.say("🎉 You found carbon in all 7! Carbon is in fuels, food, clothes, plastics and even jewellery, though the earth's crust has only <b>0.02%</b> carbon and air has only <b>0.03%</b> CO₂.", "good");
            else ui.say("<b>" + t.n + "</b>: " + t.f + " Keep tapping!", "good");
          } else ui.say("<b>" + t.n + "</b>: " + t.f + " Not everything has carbon.", "bad");
        });
      });
      ui.say("Everything around you is made of elements. Which of these things contain <b>carbon</b>? Tap to find out.");
    }

    /* ---------- Pane B: conductivity ---------- */
    var svg, circuit, liquid, ions, liqBtns = [];
    function buildB() {
      clear(paneB); liqBtns = [];
      var row = H("div", C("row"), paneB);
      LIQ.forEach(function (L) { liqBtns.push(btn(row, L.n, function () { pour(L, this); })); });
      svg = S("svg", { viewBox: "0 0 400 250", role: "img", "aria-label": "Conductivity tester circuit" }, paneB);
      circuit = S("g", null, svg);
      var wireD = "M175,215 V120 H120 V100 M120,60 V30 H182 M218,30 H280 V120 H225 V215";
      S("path", { d: wireD, class: C("wire") }, circuit);
      S("path", { d: wireD, class: C("flow") }, circuit);
      // battery
      S("rect", { x: 104, y: 60, width: 32, height: 40, rx: 6, fill: "var(--accent-2)" }, circuit);
      S("rect", { x: 114, y: 54, width: 12, height: 6, rx: 2, fill: "var(--ink)" }, circuit);
      var bt = S("text", { x: 120, y: 85, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#fff" }, circuit); bt.textContent = "+ −";
      // bulb
      S("circle", { cx: 200, cy: 30, r: 40, fill: "#ffd84d", class: C("halo") }, circuit);
      var bulb = S("circle", { cx: 200, cy: 28, r: 18, fill: "var(--card)", stroke: "var(--ink)", "stroke-width": 2.5, class: C("bulb") }, circuit);
      S("path", { d: "M193,34 l3,-8 l4,8 l4,-8 l3,8", fill: "none", stroke: "var(--ink)", "stroke-width": 1.5 }, circuit);
      S("rect", { x: 192, y: 44, width: 16, height: 8, rx: 2, fill: "var(--muted)" }, circuit);
      circuit.bulb = bulb;
      // beaker + liquid
      liquid = S("rect", { x: 142, y: 150, width: 116, height: 83, rx: 8, fill: "#cfe8ff", class: C("liquid"), style: "transform:scaleY(0)" }, svg);
      ions = S("g", { opacity: 0, style: "transition:opacity .5s" }, svg);
      [[160, 170, "+"], [190, 200, "−"], [215, 175, "+"], [240, 210, "−"], [165, 215, "−"], [235, 165, "+"]].forEach(function (p, i) {
        var o = S("g", { transform: "translate(" + p[0] + "," + p[1] + ")" }, ions);
        var g = S("g", { class: C("ion"), style: "animation-delay:" + (-i * 0.5) + "s" }, o);
        S("circle", { r: 7, fill: p[2] === "+" ? "var(--accent)" : "var(--chlorine)" }, g);
        var t = S("text", { "text-anchor": "middle", dy: "0.35em", "font-size": 11, "font-weight": 800, fill: "#fff" }, g); t.textContent = p[2];
      });
      S("path", { d: "M138,132 V225 Q138,238 151,238 H249 Q262,238 262,225 V132", fill: "none", stroke: "var(--muted)", "stroke-width": 3 }, svg);
      S("rect", { x: 170, y: 120, width: 10, height: 100, rx: 3, fill: "#9aa3ad" }, svg);
      S("rect", { x: 220, y: 120, width: 10, height: 100, rx: 3, fill: "#9aa3ad" }, svg);
      var lab = S("text", { x: 200, y: 140, "text-anchor": "middle", "font-size": 12, fill: "var(--muted)" }, svg); lab.textContent = "beaker";
      ui.say("This is a simple circuit with a gap between two metal rods. Pour a liquid into the beaker. If the bulb glows, the liquid conducts electricity.");
    }
    function pour(L, b) {
      onOnly(liqBtns, b);
      liquid.style.transform = "scaleY(0)";
      circuit.classList.remove(ID + "-live"); circuit.bulb.setAttribute("fill", "var(--card)"); ions.setAttribute("opacity", 0);
      setTimeout(function () {
        if (!svg.isConnected) return;
        liquid.setAttribute("fill", L.col);
        liquid.style.transform = "scaleY(1)";
        setTimeout(function () {
          if (!svg.isConnected) return;
          if (L.on) { circuit.classList.add(ID + "-live"); circuit.bulb.setAttribute("fill", "#ffd84d"); ions.setAttribute("opacity", 1); }
          ui.say(L.t, L.on ? "good" : "bad");
        }, 650);
      }, 250);
    }

    function show(i) {
      onOnly([tA, tB], i ? tB : tA);
      paneA.style.display = i ? "none" : ""; paneB.style.display = i ? "" : "none";
      ui.instr.innerHTML = i ? "💧 Tap a liquid to pour it into the tester." : "👆 Tap each object to find the hidden carbon.";
      if (i) buildB(); else buildA();
    }
    btn(ui.bar, "↺ Reset", function () { show(0); }, "reset");
    show(0);
    return function () { clear(el); };
  };
})();
