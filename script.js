
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




async function loadLatestNews() {
    try {
        const response = await fetch("../index.html");
        if (!response.ok) {
            throw new Error("Homepage load failed");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const home = parser.parseFromString(html, "text/html");

        const source = home.getElementById("latestNewsSource");
        const target = document.getElementById("latestSidebar");

        if (!source || !target) {
            console.error("Latest News source or sidebar not found");
            return;
        }

        target.innerHTML = "";

        source.querySelectorAll(".news-item.post").forEach(article => {
            const item = article.cloneNode(true);
            target.appendChild(item);
        });
    } catch (error) {
        console.error("Latest News loading error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadLatestNews);











