
document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("latestSidebar");

    if (!sidebar) return;

    const HOME_URL = "https://bs360news.com/";

    async function loadLatestSidebar() {

        try {

            const response = await fetch(
                HOME_URL + "?v=" + Date.now(),
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("Homepage fetch failed");
            }

            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // మీ Home Pageలో సరైన ID
            const homeLatest = doc.getElementById("latestSection");

            if (!homeLatest) {
                throw new Error("latestSection not found");
            }

            // Home Page తాజా వార్తలు
            const articles = homeLatest.querySelectorAll(
                "article.news-item.post"
            );

            if (articles.length === 0) {
                throw new Error("No articles found");
            }

            sidebar.innerHTML = "";

            articles.forEach(article => {

                const clone = article.cloneNode(true);

                // Images URLs సరిచేయడం
                clone.querySelectorAll("img").forEach(img => {

                    const src = img.getAttribute("src");

                    if (src) {
                        img.src = new URL(src, HOME_URL).href;
                    }

                });

                // Article links URLs సరిచేయడం
                clone.querySelectorAll("a").forEach(link => {

                    const href = link.getAttribute("href");

                    if (href) {
                        link.href = new URL(href, HOME_URL).href;
                    }

                });

                sidebar.appendChild(clone);

            });

        } catch (error) {

            console.error("Latest Sidebar Error:", error);

            sidebar.innerHTML =
                "<p>తాజా వార్తలు లోడ్ కాలేదు.</p>";

        }

    }

    loadLatestSidebar();

});


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














/* =====================================
   MOVIE REVIEWS PAGE - 15 ARTICLES
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const moviesGrid = document.getElementById("moviesGrid");
    const movieSource = document.getElementById("localMovieReviewsSource");

    // Movie Reviews పేజీ కాకపోతే ఈ కోడ్ పనిచేయదు
    if (!moviesGrid || !movieSource) return;

    const articles = movieSource.querySelectorAll(".news-item.post");

    if (!articles.length) {
        moviesGrid.innerHTML = "<p>ప్రస్తుతం మూవీ రివ్యూస్ అందుబాటులో లేవు.</p>";
        return;
    }

    moviesGrid.innerHTML = "";

    articles.forEach(function (article) {

        const clone = article.cloneNode(true);

        const url = clone.getAttribute("data-url");
        const image = clone.querySelector("img");
        const title = clone.querySelector(".news-content p");

        if (!url || !title) return;

        // Article URL
        clone.style.cursor = "pointer";
        clone.setAttribute("role", "link");
        clone.setAttribute("tabindex", "0");

        clone.addEventListener("click", function () {
            window.location.href = url;
        });

        clone.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.location.href = url;
            }
        });

        // Image loading
        if (image) {
            image.loading = "lazy";
            image.onerror = function () {
                this.style.display = "none";
            };
        }

        moviesGrid.appendChild(clone);

    });

});


















document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const SITE_URL = window.location.origin;

    /* =====================================
       DARK MODE
    ===================================== */

    const themeToggle = document.getElementById("themeToggle");

    function applyTheme() {

        if (!themeToggle) return;

        const savedTheme = localStorage.getItem("bs360-theme");

        if (savedTheme === "dark") {

            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️ Light";

        } else {

            document.body.classList.remove("dark-mode");
            themeToggle.textContent = "🌙 Dark";

        }

    }

    applyTheme();

    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";

            localStorage.setItem(
                "bs360-theme",
                isDark ? "dark" : "light"
            );

        });

    }


    /* =====================================
       COMMON FUNCTIONS
    ===================================== */

    function cleanText(text) {

        return String(text || "")
            .replace(/\s+/g, " ")
            .trim();

    }


    function escapeHTML(text) {

        return String(text || "").replace(/[&<>"']/g, function (char) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];

        });

    }


    /* =====================================
       ARTICLE URL NORMALIZATION

       /latest-news/slug/
       becomes
       /slug/
    ===================================== */

    function normalizeArticleUrl(rawUrl) {

        if (!rawUrl) return "";

        try {

            const url = new URL(rawUrl, SITE_URL + "/");

            /* External links unchanged */

            if (url.origin !== SITE_URL) {
                return url.href;
            }

            let pathname = url.pathname;

            /* Remove latest-news prefix */

            pathname = pathname.replace(
                /^\/latest-news\/+/i,
                "/"
            );

            pathname = pathname.replace(
                /^\/latest-news\/?$/i,
                "/"
            );

            /* Add trailing slash to folder URLs */

            if (
                pathname !== "/" &&
                !pathname.endsWith("/") &&
                !/\.[a-z0-9]+$/i.test(pathname)
            ) {

                pathname += "/";

            }

            return pathname + url.search + url.hash;

        } catch (error) {

            console.warn("Invalid article URL:", rawUrl);

            return "";

        }

    }


    /* =====================================
       IMAGE URL NORMALIZATION
    ===================================== */

    function normalizeImageUrl(rawImage) {

        if (!rawImage) return "";

        try {

            return new URL(rawImage, SITE_URL + "/").href;

        } catch (error) {

            return "";

        }

    }


    /* =====================================
       GET IMAGE SOURCE
    ===================================== */

    function getImageSource(image) {

        if (!image) return "";

        return (
            image.getAttribute("data-src") ||
            image.getAttribute("data-lazy-src") ||
            image.getAttribute("src") ||
            ""
        );

    }


    /* =====================================
       GET ARTICLES FROM SOURCE
    ===================================== */

    function getArticles(source) {

        if (!source) return [];

        const selector = [
            ".news-item.post",
            "article",
            ".news-card",
            ".movie-card",
            ".post-card",
            ".latest-news-card",
            ".trending-card",
            ".top-news-card",
            ".review-card",
            ".news-item"
        ].join(",");


        let items = [];


        if (source.matches && source.matches(selector)) {

            items.push(source);

        }


        items.push(
            ...Array.from(source.querySelectorAll(selector))
        );


        /* Fallback: linked images */

        if (!items.length) {

            items = Array.from(
                source.querySelectorAll("a[href]")
            ).filter(function (link) {

                return link.querySelector("img");

            });

        }


        const articles = items.map(function (item) {

            const image = item.querySelector("img");


            const link = item.matches("a[href]")
                ? item
                : item.querySelector("a[href]");


            const titleNode = item.querySelector(
                ".news-content p, " +
                ".news-content h3, " +
                ".news-title, " +
                ".article-title, " +
                "h1, h2, h3, h4, p, .title"
            );


            const title = cleanText(

                titleNode
                    ? titleNode.textContent
                    : (link ? link.textContent : image?.alt)

            );


            const rawImage = getImageSource(image);


            const rawUrl =
                item.getAttribute("data-url") ||
                (link ? link.getAttribute("href") : "");


            return {

                title: title,

                image: normalizeImageUrl(rawImage),

                alt: image
                    ? cleanText(image.getAttribute("alt")) || title
                    : title,

                url: normalizeArticleUrl(rawUrl)

            };

        }).filter(function (article) {

            return (
                article.title &&
                article.image &&
                article.url &&
                !article.url.startsWith("#") &&
                !/^javascript:/i.test(article.url)
            );

        });


        /* Remove duplicate URLs */

        return removeDuplicates(articles);

    }


    /* =====================================
       REMOVE DUPLICATE ARTICLES
    ===================================== */

    function removeDuplicates(articles) {

        const seen = new Set();

        return articles.filter(function (article) {

            if (!article.url || seen.has(article.url)) {
                return false;
            }

            seen.add(article.url);

            return true;

        });

    }


    /* =====================================
       HOMEPAGE SOURCE FUNCTIONS
    ===================================== */

    function getFirstAvailableArticles(home, ids) {

        for (const id of ids) {

            const source = home.getElementById(id);

            const articles = getArticles(source);

            if (articles.length) {

                return articles;

            }

        }

        return [];

    }


    function getArticlesByHeading(home, labels) {

        const wanted = labels.map(function (label) {

            return cleanText(label).toLowerCase();

        });


        const headings = Array.from(

            home.querySelectorAll(
                "h1,h2,h3,h4,.section-title,.section-head," +
                ".sidebar-title,.category-title"
            )

        );


        for (const heading of headings) {

            const headingText = cleanText(
                heading.textContent
            ).toLowerCase();


            const matches = wanted.some(function (label) {

                return (
                    headingText === label ||
                    headingText.includes(label)
                );

            });


            if (!matches) continue;


            let parent = heading;


            for (
                let level = 0;
                level < 5 && parent;
                level++, parent = parent.parentElement
            ) {

                const articles = getArticles(parent);

                if (articles.length) {

                    return articles;

                }

            }

        }

        return [];

    }


    function getSectionArticles(home, ids, labels) {

        const articles = getFirstAvailableArticles(home, ids);

        if (articles.length) {

            return articles;

        }

        return getArticlesByHeading(home, labels);

    }


    /* =====================================
       LOCAL ARTICLES
    ===================================== */

    const localNational = getArticles(

        document.getElementById("localNationalSource")

    );


    /* =====================================
       CARD HTML
    ===================================== */

    function cardHTML(article) {

        return `

            <a href="${escapeHTML(article.url)}"
               class="movie-card">

                <img
                    src="${escapeHTML(article.image)}"
                    alt="${escapeHTML(article.alt)}"
                    loading="lazy"
                >

                <div class="movie-card-content">

                    <h3 class="movie-card-title">
                        ${escapeHTML(article.title)}
                    </h3>

                </div>

            </a>

        `;

    }


    /* =====================================
       SIDEBAR HTML
    ===================================== */

    function sidebarHTML(article) {

        return `

            <a href="${escapeHTML(article.url)}"
               class="sidebar-item">

                <img
                    src="${escapeHTML(article.image)}"
                    alt="${escapeHTML(article.alt)}"
                    loading="lazy"
                >

                <div class="sidebar-item-title">
                    ${escapeHTML(article.title)}
                </div>

            </a>

        `;

    }


    /* =====================================
       DISPLAY HTML
    ===================================== */

    function show(id, html) {

        const element = document.getElementById(id);

        if (element) {

            element.innerHTML = html;

        }

    }


    /* =====================================
       FETCH HTML DOCUMENT
    ===================================== */

    async function fetchDocument(url) {

        const response = await fetch(
            url + (url.includes("?") ? "&" : "?") +
            "v=" + Date.now(),
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Page load failed: " + url
            );

        }


        const html = await response.text();

        return new DOMParser().parseFromString(
            html,
            "text/html"
        );

    }


    /* =====================================
       HOMEPAGE DOCUMENT
       Fetch only once
    ===================================== */

    let homepagePromise = null;


    function getHomepageDocument() {

        if (!homepagePromise) {

            homepagePromise = fetchDocument("/index.html")
                .catch(function (error) {

                    homepagePromise = null;

                    throw error;

                });

        }

        return homepagePromise;

    }


    /* =====================================
       SIDEBAR HEIGHT
    ===================================== */

    function matchSidebarToNationalHeight() {

        const main = document.querySelector(".movies-main");

        const sidebar = document.querySelector(".article-sidebar");


        if (!main || !sidebar) return;


        if (window.innerWidth > 1100) {

            const height = Math.ceil(
                main.getBoundingClientRect().height
            );

            sidebar.style.height = height + "px";

            sidebar.style.maxHeight = height + "px";

            sidebar.style.overflowY = "auto";

        } else {

            sidebar.style.height = "";

            sidebar.style.maxHeight = "";

            sidebar.style.overflowY = "";

        }

    }


    window.addEventListener(
        "resize",
        matchSidebarToNationalHeight
    );


    /* =====================================
       LOAD HOMEPAGE LATEST / TOP / TRENDING
    ===================================== */

    async function loadHomepageNews() {

        try {

            const home = await getHomepageDocument();


            /* HOMEPAGE LATEST NEWS */

            const homeLatest = getSectionArticles(

                home,

                [
                    "latestNewsSource",
                    "latestGrid",
                    "latestSection",
                    "latestNews",
                    "latestNewsList"
                ],

                [
                    "Latest News",
                    "Latest",
                    "తాజా వార్తలు",
                    "తాజా వార్త"
                ]

            );


            /* LOCAL + HOMEPAGE LATEST */

            const allLatest = removeDuplicates([

                ...localNational,

                ...homeLatest

            ]);


            /* TOP NEWS */

            const topNews = getSectionArticles(

                home,

                [
                    "topNewsSource",
                    "topNewsGrid",
                    "topNews",
                    "topStory",
                    "topStoryGrid",
                    "topStorySection",
                    "topNewsSection"
                ],

                [
                    "Top News",
                    "Top Story",
                    "టాప్ న్యూస్",
                    "ముఖ్య వార్తలు",
                    "ప్రధాన వార్తలు"
                ]

            );


            /* TRENDING NEWS */

            const trending = getSectionArticles(

                home,

                [
                    "trendingSource",
                    "trendingGrid",
                    "trendingSection",
                    "trendingNews",
                    "trendingTrack"
                ],

                [
                    "Trending News",
                    "Trending",
                    "ట్రెండింగ్ న్యూస్",
                    "ట్రెండింగ్"
                ]

            );


            /* MAIN LATEST GRID */

            show(

                "nationalGrid",

                allLatest.length

                    ? allLatest.map(cardHTML).join("")

                    : '<div class="loading">తాజా వార్తలు దొరకలేదు.</div>'

            );


            /* TOP NEWS SIDEBAR */

            show(

                "topNewsSidebar",

                topNews.length

                    ? topNews.map(sidebarHTML).join("")

                    : '<div class="loading">Top News దొరకలేదు.</div>'

            );


            /* TRENDING SIDEBAR */

            show(

                "trendingSidebar",

                trending.length

                    ? trending.map(sidebarHTML).join("")

                    : '<div class="loading">Trending News దొరకలేదు.</div>'

            );


            /* SIDEBAR HEIGHT */

            requestAnimationFrame(function () {

                matchSidebarToNationalHeight();

            });


            console.log("BS360 Latest News Loaded", {

                localArticles: localNational.length,

                homepageLatest: homeLatest.length,

                totalLatest: allLatest.length,

                topNews: topNews.length,

                trending: trending.length

            });


        } catch (error) {

            console.error(
                "BS360 Homepage Error:",
                error
            );


            show(

                "nationalGrid",

                '<div class="loading">తాజా వార్తలు లోడ్ కాలేదు. Homepage తనిఖీ చేయండి.</div>'

            );


            show(

                "topNewsSidebar",

                '<div class="loading">Top News లోడ్ కాలేదు.</div>'

            );


            show(

                "trendingSidebar",

                '<div class="loading">Trending News లోడ్ కాలేదు.</div>'

            );

        }

    }


    /* =====================================
       LOAD NATIONAL SIDEBAR
    ===================================== */

    async function loadNationalSidebar() {

        const target = document.getElementById(
            "nationalSidebarArticles"
        );


        if (!target) return;


        try {

            let articles = [...localNational];


            /* NATIONAL PAGE */

            let nationalDoc = null;


            try {

                nationalDoc = await fetchDocument("/national/");

            } catch (folderError) {

                try {

                    nationalDoc = await fetchDocument("/national.html");

                } catch (fileError) {

                    console.warn(
                        "National page not available:",
                        fileError
                    );

                }

            }


            if (nationalDoc) {

                let found = getArticles(

                    nationalDoc.getElementById("localNationalSource")

                );


                if (!found.length) {

                    found = getFirstAvailableArticles(

                        nationalDoc,

                        [
                            "nationalNewsSource",
                            "nationalSource",
                            "nationalGrid",
                            "nationalNewsGrid",
                            "localNationalSource"
                        ]

                    );

                }


                if (!found.length) {

                    found = getArticlesByHeading(

                        nationalDoc,

                        [
                            "జాతీయ వార్తలు",
                            "National News",
                            "National"
                        ]

                    );

                }


                articles = articles.concat(found);

            }


            /* HOMEPAGE NATIONAL ARTICLES */

            try {

                const home = await getHomepageDocument();


                const homeNational = getSectionArticles(

                    home,

                    [
                        "nationalNewsSource",
                        "nationalSource",
                        "nationalNewsGrid",
                        "nationalGrid",
                        "nationalNewsSection"
                    ],

                    [
                        "National News",
                        "జాతీయ వార్తలు",
                        "జాతీయ వార్త"
                    ]

                );


                articles = articles.concat(homeNational);


            } catch (homeError) {

                console.warn(
                    "Homepage National News Error:",
                    homeError
                );

            }


            /* REMOVE DUPLICATES */

            articles = removeDuplicates(articles);


            /* SHOW ALL NATIONAL ARTICLES */

            target.innerHTML = articles.length

                ? articles.map(sidebarHTML).join("")

                : '<p class="loading">జాతీయ వార్తలు దొరకలేదు.</p>';


            requestAnimationFrame(function () {

                matchSidebarToNationalHeight();

            });


            console.log(
                "BS360 National Sidebar:",
                articles.length
            );


        } catch (error) {

            console.error(
                "National Sidebar Error:",
                error
            );


            target.innerHTML =
                '<p class="loading">జాతీయ వార్తలు లోడ్ కాలేదు.</p>';

        }

    }


    /* =====================================
       PREVENT IMAGE DRAG
    ===================================== */

    document.querySelectorAll("img").forEach(function (img) {

        img.addEventListener("dragstart", function (event) {

            event.preventDefault();

        });

    });


    /* =====================================
       START
    ===================================== */

    loadHomepageNews();

    loadNationalSidebar();


});
