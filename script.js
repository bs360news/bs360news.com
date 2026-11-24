document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const SITE_URL = window.location.origin;

    /* =====================================
       1. DARK MODE (SINGLE CLEAN HANDLER)
    ===================================== */
    const themeButtons = document.querySelectorAll("#themeToggle, .bs-dark-btn");

    function applyTheme(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        themeButtons.forEach(function (button) {
            button.textContent = isDark ? "☀️ Light" : "🌙 Dark";
            button.setAttribute("aria-pressed", String(isDark));
        });
        try {
            localStorage.setItem("bs360-theme", isDark ? "dark" : "light");
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }
    }

    let savedTheme = "light";
    try {
        savedTheme = localStorage.getItem("bs360-theme") || "light";
    } catch (error) {}
    applyTheme(savedTheme === "dark");

    themeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const isDark = !document.body.classList.contains("dark-mode");
            applyTheme(isDark);
        });
    });

    /* =====================================
       2. HELPER FUNCTIONS
    ===================================== */
    function cleanText(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function escapeHTML(text) {
        return String(text || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&",
                "<": "<",
                ">": ">",
                '"': """,
                "'": "'"
            }[char];
        });
    }

    function normalizeUrl(rawUrl) {
        if (!rawUrl) return "";
        try {
            const url = new URL(rawUrl, SITE_URL + "/");
            if (url.origin !== SITE_URL) return url.href;
            let pathname = url.pathname
                .replace(/^\/latest-news\/+/i, "/")
                .replace(/^\/latest-news\/?$/i, "/");
            if (
                pathname !== "/" &&
                !pathname.endsWith("/") &&
                !/\.[a-z0-9]+$/i.test(pathname)
            ) {
                pathname += "/";
            }
            return pathname + url.search + url.hash;
        } catch (error) {
            return "";
        }
    }

    function normalizeImage(rawImage) {
        if (!rawImage) return "";
        try {
            return new URL(rawImage, SITE_URL + "/").href;
        } catch (error) {
            return "";
        }
    }

    function extractArticles(container) {
        if (!container) return [];
        const items = Array.from(container.querySelectorAll("article, .news-item"));
        const seen = new Set();

        return items
            .map(function (item) {
                const img = item.querySelector("img");
                const link = item.matches("a[href]") ? item : item.querySelector("a[href]");
                const titleEl = item.querySelector(".news-content p, .news-content h3, h1, h2, h3, h4, p");

                const title = cleanText(
                    titleEl ? titleEl.textContent : (link ? link.textContent : (img ? img.alt : ""))
                );
                const rawImg = img
                    ? (img.getAttribute("data-src") || img.getAttribute("data-lazy-src") || img.getAttribute("src") || "")
                    : "";
                const rawUrl = item.getAttribute("data-url") || (link ? link.getAttribute("href") : "");

                return {
                    title: title,
                    image: normalizeImage(rawImg),
                    alt: img ? (cleanText(img.getAttribute("alt")) || title) : title,
                    url: normalizeUrl(rawUrl)
                };
            })
            .filter(function (art) {
                if (!art.title || !art.image || !art.url) return false;
                if (art.url.startsWith("#") || /^javascript:/i.test(art.url)) return false;
                if (seen.has(art.url)) return false;
                seen.add(art.url);
                return true;
            });
    }

    function renderSidebarList(articles) {
        return articles
            .map(function (art) {
                return `
                    <a href="${escapeHTML(art.url)}" class="sidebar-item">
                        <img src="${escapeHTML(art.image)}" alt="${escapeHTML(art.alt)}">
                        <div class="sidebar-item-title">${escapeHTML(art.title)}</div>
                    </a>
                `;
            })
            .join("");
    }

    /* =====================================
       3. HOMEPAGE FETCH (ONLY WHEN NEEDED)
    ===================================== */
    let homeDocPromise = null;

    function getHomeDoc() {
        if (!homeDocPromise) {
            homeDocPromise = fetch("/index.html?v=" + Date.now(), { cache: "no-store" })
                .then(function (res) {
                    if (!res.ok) throw new Error("Failed to fetch homepage");
                    return res.text();
                })
                .then(function (html) {
                    return new DOMParser().parseFromString(html, "text/html");
                })
                .catch(function (err) {
                    homeDocPromise = null;
                    throw err;
                });
        }
        return homeDocPromise;
    }

    /* =====================================
       4. POPULATE EMPTY SIDEBAR CONTAINERS
          (NEVER OVERWRITE NON-EMPTY ONES)
    ===================================== */
    async function hydrateSidebar(targetId, sectionIds) {
        const target = document.getElementById(targetId);
        if (!target) return;

        // If HTML already has articles inside, keep them immediately visible
        if (target.querySelector("article, .sidebar-item, .news-item")) {
            return;
        }

        try {
            const home = await getHomeDoc();
            let collected = [];

            sectionIds.forEach(function (secId) {
                const sec = home.getElementById(secId);
                if (sec) {
                    collected = collected.concat(extractArticles(sec));
                }
            });

            if (collected.length) {
                target.innerHTML = renderSidebarList(collected);
            }
        } catch (err) {
            console.warn("Sidebar hydrate warning for #" + targetId + ":", err);
        }
    }

    // Only runs on pages where these empty containers exist
    hydrateSidebar("nationalSidebarArticles", ["nationalSection"]);
    hydrateSidebar("worldSidebarArticles", ["worldSection"]);
    hydrateSidebar("topNewsSidebar", ["topNewsSource"]);

    const trendingEl = document.getElementById("trendingSidebar");
    if (trendingEl && !trendingEl.querySelector("article, .sidebar-item, .news-item")) {
        hydrateSidebar("trendingSidebar", ["trendingSection"]);
    }

    /* =====================================
       5. LATEST NEWS GRID / SIDEBAR (SUBPAGES)
    ===================================== */
    const latestGrid = document.getElementById("latestNewsGrid");
    const latestSidebar = document.getElementById("latestSidebar");

    if (latestGrid || latestSidebar) {
        (async function () {
            try {
                const home = await getHomeDoc();
                const latestArticles = extractArticles(home.getElementById("latestSection"));

                if (latestArticles.length) {
                    const html = latestArticles
                        .map(function (art) {
                            return `
                                <article class="news-item post">
                                    <a href="${escapeHTML(art.url)}">
                                        <img src="${escapeHTML(art.image)}" alt="${escapeHTML(art.alt)}">
                                    </a>
                                    <div class="news-content">
                                        <p><a href="${escapeHTML(art.url)}">${escapeHTML(art.title)}</a></p>
                                    </div>
                                </article>
                            `;
                        })
                        .join("");

                    if (latestGrid) latestGrid.innerHTML = html;
                    if (latestSidebar) latestSidebar.innerHTML = html;
                }
            } catch (err) {
                console.warn("Latest news load warning:", err);
            }
        })();
    }

    /* =====================================
       6. MOVIE REVIEWS PAGE
    ===================================== */
    const moviesGrid = document.getElementById("moviesGrid");
    const movieSource = document.getElementById("localMovieReviewsSource");

    if (moviesGrid && movieSource) {
        const articles = movieSource.querySelectorAll(".news-item.post");
        if (articles.length) {
            moviesGrid.innerHTML = "";
            articles.forEach(function (article) {
                const clone = article.cloneNode(true);
                const url = clone.getAttribute("data-url");
                const img = clone.querySelector("img");
                const title = clone.querySelector(".news-content p");
                if (!url || !title) return;

                clone.style.cursor = "pointer";
                clone.addEventListener("click", function () {
                    window.location.href = url;
                });
                if (img) {
                    img.onerror = function () {
                        this.style.display = "none";
                    };
                }
                moviesGrid.appendChild(clone);
            });
        }
    }

    /* =====================================
       7. PREVENT IMAGE DRAG
    ===================================== */
    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("dragstart", function (event) {
            event.preventDefault();
        });
    });
});

/* =====================================
   8. NAVIGATION SPACER
===================================== */
(function () {
    const nav = document.querySelector(".bs-navigation");
    if (!nav) return;

    const spacer = document.createElement("div");
    spacer.className = "bs-nav-spacer";
    nav.insertAdjacentElement("afterend", spacer);

    function syncNavSpace() {
        spacer.style.height = nav.offsetHeight + "px";
    }

    syncNavSpace();
    window.addEventListener("resize", syncNavSpace);
})();
