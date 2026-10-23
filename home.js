// =========================
// HOME PAGE JAVASCRIPT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // Fade animation
    document.querySelector(".hero").style.opacity = "0";

    setTimeout(() => {
        document.querySelector(".hero").style.transition = "1s";
        document.querySelector(".hero").style.opacity = "1";
    }, 200);

    // Random star twinkle
    const stars = document.querySelectorAll(".stars span");

    setInterval(() => {

        const star = stars[Math.floor(Math.random() * stars.length)];

        star.style.transform = "scale(2)";
        star.style.opacity = "1";

        setTimeout(() => {
            star.style.transform = "scale(1)";
            star.style.opacity = ".5";
        }, 500);

    }, 500);

});

// =========================
// ENTER BUTTON
// =========================

const button = document.querySelector(".hero button");

button.addEventListener("click", () => {

    button.innerHTML = "Loading...";

    button.style.transform = "scale(.95)";

    setTimeout(() => {

        window.location.href = "login.html";

    }, 700);

});

// =========================
// ENTER KEY
// =========================

document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        button.click();

    }

});

// =========================
// PARALLAX EFFECT
// =========================

document.addEventListener("mousemove", (e) => {

    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;

    document.querySelector(".background").style.transform =
        `translate(${x}px, ${y}px)`;

});