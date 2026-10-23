/* ==========================================
   QUIZORA  |  nav.js
   - Back button on every page
   - Redirect guards (no login / no result -> correct page)
   - Browser Back button handling
   Usage on <body>:
     data-back="categories.html"   -> back button target
     data-back-label="Back"        -> optional label
     data-require="login"          -> must be logged in
     data-require="result"         -> must have finished a quiz
========================================== */
(function () {
    "use strict";

    var body = document.body;
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    function has(k) { try { return !!localStorage.getItem(k); } catch (e) { return false; } }
    function go(url) { location.replace(url); }

    /* ---------- 1. GUARDS ---------- */
    var need = body.getAttribute("data-require");

    if (need === "login" && !has("participantId")) {
        go("login.html");
        return;
    }
    if (need === "result" && (!has("participantId") || localStorage.getItem("score") === null)) {
        go(has("participantId") ? "categories.html" : "login.html");
        return;
    }

    /* ---------- 2. BACK BUTTON ---------- */
    var target = body.getAttribute("data-back");
    if (!has("participantId") && body.getAttribute("data-back-anon")) { target = body.getAttribute("data-back-anon"); }

    if (target) {
        var a = document.createElement("a");
        a.className = "qz-back" + (body.hasAttribute("data-back-dark") ? " qz-dark" : "");
        a.href = target;
        a.setAttribute("aria-label", "Go back");
        a.innerHTML = "<span aria-hidden='true'>←</span><span>" +
            (body.getAttribute("data-back-label") || "Back") + "</span>";

        /* leaving a running quiz -> confirm */
        if (body.hasAttribute("data-confirm-leave")) {
            a.addEventListener("click", function (e) {
                if (window.__quizRunning && !confirm("Quiz is running. If you leave now your progress will be lost. Leave?")) {
                    e.preventDefault();
                }
            });
        }
        body.classList.add("qz-has-back");
        body.insertBefore(a, body.firstChild);

        /* ESC key = back (desktop) */
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !document.querySelector(".show")) { a.click(); }
        });
    }

    /* ---------- 3. BROWSER BACK BUTTON ---------- */
    /* result page: browser Back must not re-open the finished quiz */
    if (page === "result.html") {
        history.pushState({ qz: 1 }, "", location.href);
        window.addEventListener("popstate", function () { go("categories.html"); });
    }

    /* quiz page: browser Back -> categories (with confirm if quiz running) */
    if (page === "quiz.html") {
        history.pushState({ qz: 1 }, "", location.href);
        window.addEventListener("popstate", function () {
            if (!window.__quizRunning || confirm("Quiz is running. Leave and lose progress?")) {
                go("categories.html");
            } else {
                history.pushState({ qz: 1 }, "", location.href);
            }
        });
    }

    /* page restored from the browser cache (back/forward) -> re-check guards */
    window.addEventListener("pageshow", function (e) {
        if (e.persisted) { location.reload(); }
    });
})();
