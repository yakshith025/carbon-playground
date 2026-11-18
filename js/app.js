(function () {
  "use strict";

  var CONCEPTS = window.CONCEPTS || [];
  var CHAPTER = window.CHAPTER || { title: "Carbon and its Compounds", subtitle: "", intro: "" };
  var main = document.getElementById("main");
  var topicList = document.getElementById("topicList");
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("scrim");
  var menuBtn = document.getElementById("menuBtn");
  var pill = document.getElementById("progressPill");
  var cleanup = null;
  var loaded = {};

  // ---------- progress (per-viewer convenience only) ----------
  var STORE = "carbon-playground-done";
  function getDone() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function setDone(id) {
    var d = getDone(); d[id] = true;
    try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {}
    renderNav(); updatePill();
  }
  function updatePill() {
    var d = getDone(), n = CONCEPTS.filter(function (c) { return d[c.id]; }).length;
    pill.textContent = n + " / " + CONCEPTS.length + " ⭐";
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  // ---------- nav ----------
  function renderNav(activeId) {
    var d = getDone();
    activeId = activeId || currentId();
    var html = '<li class="t-home"><a href="#home" class="' + (activeId === "home" ? "active" : "") + '"><span class="t-emoji">🏠</span>Start here</a></li>';
    CONCEPTS.forEach(function (c, i) {
      html += '<li><a href="#' + c.id + '" class="' + (c.id === activeId ? "active" : "") + '">' +
        '<span class="t-emoji">' + (c.emoji || "•") + "</span>" +
        "<span>" + (i + 1) + ". " + esc(c.title) + "</span>" +
        (d[c.id] ? '<span class="t-done" title="Done">✓</span>' : "") + "</a></li>";
    });
    topicList.innerHTML = html;
  }

  function currentId() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    return CONCEPTS.some(function (c) { return c.id === h; }) ? h : "home";
  }

  // ---------- pages ----------
  function renderHome() {
    var d = getDone();
    var cards = CONCEPTS.map(function (c, i) {
      return '<a class="card-link" href="#' + c.id + '">' +
        (d[c.id] ? '<span class="done-badge">✓ done</span>' : "") +
        '<span class="num">Topic ' + (i + 1) + "</span>" +
        '<span class="emoji">' + (c.emoji || "🧪") + "</span>" +
        "<h3>" + esc(c.title) + "</h3><p>" + esc(c.tagline || "") + "</p></a>";
    }).join("");
    main.innerHTML =
      '<section class="hero">' +
        '<div class="kicker">NCERT Class 10 Science · Chapter 4</div>' +
        "<h1>" + esc(CHAPTER.title) + "</h1>" +
        (CHAPTER.subtitle ? "<p><b>" + esc(CHAPTER.subtitle) + "</b></p>" : "") +
        (CHAPTER.intro || "") +
        (CONCEPTS.length ? '<a class="btn" href="#' + CONCEPTS[0].id + '">Start Topic 1 →</a>' : "") +
      "</section>" +
      '<div class="how">' +
        "<div><b>📖 1. Read</b><span>A short, simple explanation of the idea.</span></div>" +
        "<div><b>🎮 2. Play</b><span>Drag, click and slide to see the chemistry happen.</span></div>" +
        "<div><b>✅ 3. Check</b><span>Two quick questions. Get them right to earn a star.</span></div>" +
      "</div>" +
      '<div class="grid">' + cards + "</div>";
  }

  function renderConcept(id) {
    var i = CONCEPTS.findIndex(function (c) { return c.id === id; });
    var c = CONCEPTS[i], prev = CONCEPTS[i - 1], next = CONCEPTS[i + 1];
    var kp = (c.keyPoints || []).map(function (k) { return "<li>" + k + "</li>"; }).join("");
    var quiz = (c.quiz || []).map(function (q, qi) {
      return '<div class="quiz-q" data-q="' + qi + '"><p class="q">' + (qi + 1) + ". " + q.q + "</p>" +
        '<div class="options">' + q.options.map(function (o, oi) {
          return '<button class="opt" data-o="' + oi + '">' + o + "</button>";
        }).join("") + '</div><div class="why-slot"></div></div>';
    }).join("");

    main.innerHTML =
      '<header class="concept-head">' +
        '<div class="num">Topic ' + (i + 1) + " of " + CONCEPTS.length + "</div>" +
        "<h1>" + (c.emoji ? c.emoji + " " : "") + esc(c.title) + "</h1>" +
        (c.tagline ? '<p class="tagline">' + esc(c.tagline) + "</p>" : "") +
        (c.textbookRef ? '<span class="ref">📘 NCERT ' + esc(c.textbookRef) + "</span>" : "") +
      "</header>" +
      '<section class="step explain-step"><h2 class="step-label"><span class="badge">1</span>Understand it</h2>' +
        '<div class="explain">' + (c.explain || "") + "</div>" +
        (kp ? '<div class="keypoints"><h3>⭐ Remember</h3><ul>' + kp + "</ul></div>" : "") +
      "</section>" +
      '<section class="step play"><h2 class="step-label"><span class="badge">2</span>Play with it</h2>' +
        (c.playHint ? '<p class="play-hint">' + c.playHint + "</p>" : "") +
        '<div class="anim-stage" id="stage"></div>' +
      "</section>" +
      (quiz ? '<section class="step check"><h2 class="step-label"><span class="badge">3</span>Check yourself</h2>' +
        '<div id="quiz">' + quiz + '</div><div id="quizResult"></div></section>' : "") +
      '<nav class="pager">' +
        (prev ? '<a class="btn ghost" href="#' + prev.id + '">← ' + esc(prev.title) + "</a>" : '<a class="btn ghost" href="#home">← All topics</a>') +
        (next ? '<a class="btn" href="#' + next.id + '">Next: ' + esc(next.title) + " →</a>" : '<a class="btn" href="#home">🎉 Finish: all topics</a>') +
      "</nav>";

    mountAnimation(c.id);
    wireQuiz(c);
  }

  function wireQuiz(c) {
    var box = document.getElementById("quiz");
    if (!box) return;
    var answered = {}, correct = {};
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".opt");
      if (!btn) return;
      var qEl = btn.closest(".quiz-q"), qi = +qEl.dataset.q, q = c.quiz[qi], oi = +btn.dataset.o;
      if (correct[qi]) return;
      var ok = oi === q.answer;
      btn.classList.add(ok ? "right" : "wrong");
      btn.disabled = true;
      qEl.querySelector(".why-slot").innerHTML =
        '<div class="why ' + (ok ? "right" : "wrong") + '">' + (ok ? "✅ Correct! " : "❌ Not quite, try again. ") + (ok ? (q.why || "") : "Hint: look at the ⭐ Remember box above, or play with the animation once more.") + "</div>";
      answered[qi] = true;
      if (ok) {
        correct[qi] = true;
        qEl.querySelectorAll(".opt").forEach(function (b) { b.disabled = true; });
      }
      if (Object.keys(correct).length === c.quiz.length) {
        document.getElementById("quizResult").innerHTML = '<p class="celebrate">🌟 Great job! You earned a star for this topic.</p>';
        setDone(c.id);
      }
    });
  }

  function mountAnimation(id) {
    var stage = document.getElementById("stage");
    function go() {
      var fn = window.ANIMATIONS && window.ANIMATIONS[id];
      if (!fn) { stage.innerHTML = '<div class="anim-missing">This animation is coming soon.</div>'; return; }
      try {
        var r = fn(stage);
        cleanup = typeof r === "function" ? r : null;
      } catch (err) {
        console.error(err);
        stage.innerHTML = '<div class="anim-missing">Oops, this animation could not start. Try reloading the page.</div>';
      }
    }
    if (loaded[id]) { go(); return; }
    var s = document.createElement("script");
    s.src = "js/animations/" + id + ".js";
    s.onload = function () { loaded[id] = true; if (currentId() === id) go(); };
    s.onerror = function () { loaded[id] = true; if (currentId() === id) go(); };
    document.body.appendChild(s);
  }

  // ---------- router ----------
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    var id = currentId();
    if (id === "home") renderHome(); else renderConcept(id);
    renderNav(id);
    closeMenu();
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
    main.focus({ preventScroll: true });
    document.title = id === "home" ? "Carbon Playground" : (CONCEPTS.find(function (c) { return c.id === id; }).title + " · Carbon Playground");
  }

  function closeMenu() { sidebar.classList.remove("open"); scrim.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", open); scrim.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  scrim.addEventListener("click", closeMenu);
  window.addEventListener("hashchange", route);

  updatePill();
  route();
})();
