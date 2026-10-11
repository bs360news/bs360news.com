
/* ================= BS 360 NEWS DARK MODE ================= */

document.addEventListener("DOMContentLoaded", function () {

    const themeButton = document.getElementById("themeToggle");

    if (!themeButton) {
        return;
    }

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeButton.textContent = "☀️ Light";
        } else {
            themeButton.textContent = "🌙 Dark";
        }

    });

});









document.addEventListener("DOMContentLoaded", function () {
    const moreTopNews = document.querySelector(".top-side-articles");
    const mostReadList = document.getElementById("mostReadList");
    const mostReadSection = document.getElementById("mostReadSection");

    if (!moreTopNews || !mostReadList || !mostReadSection) {
        console.warn("MORE TOP NEWS / MOST READ container missing.");
        return;
    }

    // MORE TOP NEWS articles ను MOST READ లోకి తరలించకండి.
    // MOST READ కు ప్రత్యేక articles ఇక్కడ జోడించాలి.
    mostReadList.innerHTML = "";

    // Most Read articles ఇంకా ఇవ్వకపోతే ఖాళీ section చూపించకండి.
    mostReadSection.style.display = "none";
});


