
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














document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch(
            "https://bs360news.com/index.html?v=" + Date.now(),
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("Homepage fetch failed: " + response.status);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const home = parser.parseFromString(html, "text/html");

        function getArticles(sourceId) {
            const source = home.getElementById(sourceId);

            if (!source) {
                console.error("Homepage section not found:", sourceId);
                return [];
            }

            const items = source.querySelectorAll(
                "article, .news-item.post, .news-card"
            );

            const seen = new Set();

            return Array.from(items).map(function (item) {
                const link = item.querySelector("a[href]");
                const img = item.querySelector("img");
                const heading = item.querySelector(
                    ".news-content p, h3, h2, p"
                );

                const title = (
                    heading?.textContent ||
                    link?.textContent ||
                    ""
                ).trim();

                const url =
                    item.getAttribute("data-url") ||
                    link?.getAttribute("href") ||
                    "";

                const image = img?.getAttribute("src") || "";
                const key = url || title;

                if (!title || !image || !url || seen.has(key)) {
                    return null;
                }

                seen.add(key);
                return { title, image, url };
            }).filter(Boolean);
        }

        function fixPath(path) {
            if (!path) return "";

            if (
                /^(https?:)?\/\//i.test(path) ||
                path.startsWith("/") ||
                path.startsWith("../") ||
                path.startsWith("#")
            ) {
                return path;
            }

            return "../" + path;
        }

        function render(targetId, articles, sidebar = false) {
            const target = document.getElementById(targetId);

            if (!target) {
                console.warn("Article HTML section missing:", targetId);
                return;
            }

            target.replaceChildren();

            articles.forEach(function (item) {
                const link = document.createElement("a");
                link.href = fixPath(item.url);
                link.className = sidebar ? "sidebar-item" : "news-card";

                const img = document.createElement("img");
                img.src = fixPath(item.image);
                img.alt = item.title;
                img.loading = "lazy";

                const title = document.createElement(
                    sidebar ? "span" : "h3"
                );
                title.textContent = item.title;

                link.append(img, title);
                target.appendChild(link);
            });

            console.log(targetId + ": " + articles.length + " articles");
        }

        const latest = getArticles("latestGrid");
        const trending = getArticles("trendingSidebar");
        const sports = getArticles("sportsSection");
        const movies = getArticles("entertainmentSection");
        const apts = getArticles("aptsSection");
        const business = getArticles("businessSection");

        render("latestSidebar", latest, true);
        render("trendingSidebar", trending, true);

        render("latestGrid", latest);
        render("sportsGrid", sports);
        render("moviesGrid", movies);
        render("aptsGrid", apts);
        render("businessGrid", business);

        console.log("BS360NEWS: Article loading completed.");

    } catch (error) {
        console.error("BS360NEWS loading error:", error);
    }
});

