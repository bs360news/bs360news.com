/* =========================================================
   BS 360 NEWS - NEW HOMEPAGE JAVASCRIPT
   Version: 2026-10-04

   Works with:
   - New index.html
   - Separate article sections
   - Legacy .post source
   - Hero
   - Headlines
   - Latest
   - Movies
   - Sports
   - AP & Telangana
   - Business
   - Bigg Boss 10
   - Trending
   - Most Read
   - Search
   - Dark mode
   - Mobile menu
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    const safeText = value =>
        String(value || "").trim();


    const normalizeCategory = category => {

        const value = safeText(category)
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/_/g, "")
            .replace(/-/g, "");


        if (
            [
                "ap",
                "ts",
                "apts",
                "ap/ts",
                "ap&ts",
                "apandts"
            ].includes(value)
        ) {
            return "apts";
        }


        if (
            [
                "sports",
                "sport"
            ].includes(value)
        ) {
            return "sports";
        }


        if (
            [
                "cinema",
                "movies",
                "movie",
                "entertainment"
            ].includes(value)
        ) {
            return "entertainment";
        }


        if (
            [
                "business",
                "businessnews"
            ].includes(value)
        ) {
            return "business";
        }


        if (
            [
                "bigboss",
                "bigboss10"
            ].includes(value)
        ) {
            return "bigboss";
        }


        return value;
    };


    /* =====================================================
       READ ARTICLE SOURCE
    ===================================================== */

    function readArticles(sourceElement) {

        if (!sourceElement) {
            return [];
        }


        return $$(".news-item.post, .post", sourceElement)
            .map(item => {

                const image = $("img", item);

                const title =
                    safeText(
                        item.dataset.title ||
                        $(".news-content p", item)?.textContent ||
                        image?.getAttribute("alt") ||
                        ""
                    );


                return {

                    title,

                    image:
                        image?.getAttribute("src") || "",

                    alt:
                        image?.getAttribute("alt") ||
                        title,

                    url:
                        item.dataset.url || "#",

                    category:
                        normalizeCategory(
                            item.dataset.category || ""
                        ),

                    section:
                        safeText(
                            item.dataset.section
                        ).toLowerCase()

                };

            })
            .filter(article =>
                article.title &&
                article.image
            );
    }


    /* =====================================================
       MAIN SOURCE
    ===================================================== */

    const legacySource =
        $("#legacyNewsSource");


    const allArticles =
        readArticles(legacySource);


    console.log(
        "BS360 ARTICLES:",
        allArticles.length
    );


    /* =====================================================
       UNIQUE ARTICLES
    ===================================================== */

    function uniqueArticles(list) {

        const used = new Set();


        return list.filter(article => {

            const key =
                safeText(article.url)
                    .toLowerCase()
                    .replace(/\/+$/, "");


            if (!key || used.has(key)) {
                return false;
            }


            used.add(key);

            return true;
        });
    }


    /* =====================================================
       SEPARATE SOURCES
       
       Future-proof:
       If you add these IDs later, JS automatically uses them.
    ===================================================== */

    function readSeparate(id) {

        const element =
            document.getElementById(id);


        return element
            ? readArticles(element)
            : [];
    }


    const separateLatest =
        readSeparate("latestNewsSource");


    const separateTrending =
        readSeparate("trendingSource");


    const separateMostRead =
        readSeparate("mostReadSource");


    const separateApTs =
        readSeparate("aptsSource");


    const separateSports =
        readSeparate("sportsSource");


    const separateEntertainment =
        readSeparate("entertainmentSource");


    const separateBusiness =
        readSeparate("businessSource");


    const separateBigBoss =
        readSeparate("bigbossSource");


    /* =====================================================
       SECTION DATA
    ===================================================== */

    function categoryData(category) {

        return uniqueArticles(
            allArticles.filter(article =>
                article.category === category
            )
        );
    }


    let latestData =
        separateLatest.length
            ? uniqueArticles(separateLatest)
            : uniqueArticles(
                allArticles.filter(
                    article =>
                        article.section === "latest"
                )
            );


    let trendingData =
        separateTrending.length
            ? uniqueArticles(separateTrending)
            : uniqueArticles(
                allArticles.filter(
                    article =>
                        article.section === "trending"
                )
            );


    let mostReadData =
        separateMostRead.length
            ? uniqueArticles(separateMostRead)
            : uniqueArticles(
                allArticles.filter(
                    article =>
                        article.section === "mostread" ||
                        article.section === "most-read"
                )
            );


    let moviesData =
        separateEntertainment.length
            ? uniqueArticles(separateEntertainment)
            : categoryData("entertainment");


    let sportsData =
        separateSports.length
            ? uniqueArticles(separateSports)
            : categoryData("sports");


    let apTsData =
        separateApTs.length
            ? uniqueArticles(separateApTs)
            : categoryData("apts");


    let businessData =
        separateBusiness.length
            ? uniqueArticles(separateBusiness)
            : categoryData("business");


    let bigBossData =
        separateBigBoss.length
            ? uniqueArticles(separateBigBoss)
            : uniqueArticles(
                allArticles.filter(
                    article =>
                        article.category === "bigboss" ||
                        article.section === "bigboss"
                )
            );


    /* =====================================================
       FALLBACK LATEST
    ===================================================== */

    if (!latestData.length) {

        latestData =
            uniqueArticles(
                allArticles.filter(
                    article =>
                        article.category !== "bigboss"
                )
            );
    }


    /* =====================================================
       CARD GENERATORS
    ===================================================== */

    function normalCard(article) {

        return `
            <a
                class="news-card"
                href="${article.url}"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt}"
                    loading="lazy"
                >

                <h3>
                    ${article.title}
                </h3>

            </a>
        `;
    }


    function categoryCard(article) {

        return `
            <a
                class="category-card"
                href="${article.url}"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt}"
                    loading="lazy"
                >

                <div class="category-card-content">

                    <h3>
                        ${article.title}
                    </h3>

                </div>

            </a>
        `;
    }


    function bigBossCard(article) {

        return `
            <a
                class="bb-card"
                href="${article.url}"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt}"
                    loading="lazy"
                >

                <div class="bb-overlay">

                    <h3>
                        ${article.title}
                    </h3>

                </div>

            </a>
        `;
    }


    /* =====================================================
       HERO
       
       1 BIG + 4 SIDE STORIES
    ===================================================== */

    const heroMain =
        $("#heroMain");

    const heroSide =
        $("#heroSide");


    if (heroMain && latestData.length) {

        const hero =
            latestData[0];


        heroMain.innerHTML = `
            <a
                class="hero"
                href="${hero.url}"
            >

                <img
                    src="${hero.image}"
                    alt="${hero.alt}"
                >

                <span class="hero-label">
                    BREAKING
                </span>

                <div class="hero-content">

                    <h1>
                        ${hero.title}
                    </h1>

                    <span>
                        READ MORE →
                    </span>

                </div>

            </a>
        `;
    }


    if (heroSide) {

        heroSide.innerHTML =
            latestData
                .slice(1, 5)
                .map(article => `

                    <a
                        class="side"
                        href="${article.url}"
                    >

                        <img
                            src="${article.image}"
                            alt="${article.alt}"
                            loading="lazy"
                        >

                        <div>

                            <h3>
                                ${article.title}
                            </h3>

                            <small>
                                తాజా అప్‌డేట్
                            </small>

                        </div>

                    </a>

                `)
                .join("");
    }


    /* =====================================================
       TOP HEADLINES
    ===================================================== */

    const headlineTrack =
        $("#headlineTrack");


    if (headlineTrack) {

        const headlineData =
            uniqueArticles([
                ...latestData,
                ...trendingData
            ]);


        headlineTrack.innerHTML =
            headlineData
                .slice(0, 8)
                .map(article => `

                    <a
                        href="${article.url}"
                    >
                        ${article.title}
                    </a>

                `)
                .join(
                    '<i>•</i>'
                );
    }


    /* =====================================================
       LATEST NEWS
       EXACTLY 6
    ===================================================== */

    const latestGrid =
        $("#latestGrid");


    if (latestGrid) {

        latestGrid.innerHTML =
            latestData
                .slice(0, 6)
                .map(normalCard)
                .join("");


        if (!latestData.length) {

            latestGrid.innerHTML = `
                <p class="empty-message">
                    తాజా వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    /* =====================================================
       CATEGORY RENDER
       
       1 BIG + 4 SMALL
       New CSS can control layout.
    ===================================================== */

    function renderCategoryGrid(
        targetId,
        data
    ) {

        const target =
            document.getElementById(targetId);


        if (!target) {
            return;
        }


        const items =
            uniqueArticles(data)
                .slice(0, 5);


        target.innerHTML =
            items
                .map((article, index) => {

                    return `
                        <a
                            class="category-card ${
                                index === 0
                                    ? "featured"
                                    : ""
                            }"
                            href="${article.url}"
                        >

                            <img
                                src="${article.image}"
                                alt="${article.alt}"
                                loading="lazy"
                            >

                            <div class="category-card-content">

                                <h3>
                                    ${article.title}
                                </h3>

                            </div>

                        </a>
                    `;
                })
                .join("");


        if (!items.length) {

            target.innerHTML = `
                <p class="empty-message">
                    వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    renderCategoryGrid(
        "moviesGrid",
        moviesData
    );


    renderCategoryGrid(
        "sportsGrid",
        sportsData
    );


    renderCategoryGrid(
        "aptsGrid",
        apTsData
    );


    renderCategoryGrid(
        "businessGrid",
        businessData
    );


    /* =====================================================
       BIGG BOSS 10
    ===================================================== */

    const bigbossTrack =
        $("#bigbossTrack");


    if (bigbossTrack) {

        bigbossTrack.innerHTML =
            bigBossData
                .slice(0, 10)
                .map(bigBossCard)
                .join("");


        if (!bigBossData.length) {

            bigbossTrack.innerHTML = `
                <p class="empty-message">
                    బిగ్ బాస్ వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    /* =====================================================
       BIGG BOSS AUTO SCROLL
       
       Works only if horizontal overflow exists.
    ===================================================== */

    if (
        bigbossTrack &&
        bigBossData.length > 4
    ) {

        let bbPosition = 0;


        setInterval(() => {

            if (
                bigbossTrack.scrollWidth <=
                bigbossTrack.clientWidth
            ) {
                return;
            }


            bbPosition +=
                bigbossTrack.clientWidth * 0.75;


            if (
                bbPosition >=
                bigbossTrack.scrollWidth -
                bigbossTrack.clientWidth
            ) {

                bbPosition = 0;
            }


            bigbossTrack.scrollTo({
                left: bbPosition,
                behavior: "smooth"
            });

        }, 5000);
    }


    /* =====================================================
       TRENDING
       EXACTLY 12
    ===================================================== */

    const trendingGrid =
        $("#trendingGrid");


    if (trendingGrid) {

        trendingGrid.innerHTML =
            trendingData
                .slice(0, 12)
                .map((article, index) => `

                    <a
                        class="trend"
                        href="${article.url}"
                    >

                        <b>
                            ${index + 1}
                        </b>

                        <img
                            src="${article.image}"
                            alt="${article.alt}"
                            loading="lazy"
                        >

                        <h3>
                            ${article.title}
                        </h3>

                    </a>

                `)
                .join("");


        if (!trendingData.length) {

            trendingGrid.innerHTML = `
                <p class="empty-message">
                    ట్రెండింగ్ వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    /* =====================================================
       MOST READ
       EXACTLY 8
    ===================================================== */

    const mostReadList =
        $("#mostReadList");


    if (mostReadList) {

        mostReadList.innerHTML =
            mostReadData
                .slice(0, 8)
                .map((article, index) => `

                    <a
                        class="most"
                        href="${article.url}"
                    >

                        <b>
                            ${index + 1}
                        </b>

                        <div>

                            <h3>
                                ${article.title}
                            </h3>

                            <small>
                                Readers are viewing
                            </small>

                        </div>

                        <img
                            src="${article.image}"
                            alt="${article.alt}"
                            loading="lazy"
                        >

                    </a>

                `)
                .join("");


        if (!mostReadData.length) {

            mostReadList.innerHTML = `
                <p class="empty-message">
                    Most Read వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    /* =====================================================
       MOST READ TOP
       TOP 5
    ===================================================== */

    const mostReadTop =
        $("#mostReadTop");


    if (mostReadTop) {

        mostReadTop.innerHTML =
            mostReadData
                .slice(0, 5)
                .map((article, index) => `

                    <a
                        class="top-read"
                        href="${article.url}"
                    >

                        <b>
                            ${index + 1}
                        </b>

                        <img
                            src="${article.image}"
                            alt="${article.alt}"
                            loading="lazy"
                        >

                        <span>
                            ${article.title}
                        </span>

                    </a>

                `)
                .join("");


        if (!mostReadData.length) {

            mostReadTop.innerHTML = `
                <p class="empty-message">
                    Most Read వార్తలు అందుబాటులో లేవు
                </p>
            `;
        }
    }


    /* =====================================================
       SEARCH
       
       Searches:
       - Legacy
       - Latest
       - Trending
       - Most Read
       - Movies
       - Sports
       - AP TS
       - Business
       - Bigg Boss
    ===================================================== */

    const searchInput =
        $("#searchInput");

    const searchBtn =
        $("#searchBtn");


    const searchArticles =
        uniqueArticles([
            ...allArticles,
            ...separateLatest,
            ...separateTrending,
            ...separateMostRead,
            ...separateApTs,
            ...separateSports,
            ...separateEntertainment,
            ...separateBusiness,
            ...separateBigBoss
        ]);


    function performSearch() {

        if (!searchInput) {
            return;
        }


        const query =
            safeText(searchInput.value)
                .toLowerCase();


        if (!query) {

            searchInput.focus();

            return;
        }


        const result =
            searchArticles.find(article =>
                article.title
                    .toLowerCase()
                    .includes(query)
            );


        if (result) {

            window.location.href =
                result.url;

        } else {

            alert(
                "వార్త దొరకలేదు. మరో పదంతో వెతకండి."
            );
        }
    }


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            performSearch
        );
    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    performSearch();
                }
            }
        );
    }


    /* =====================================================
       DARK MODE
       
       Supports both:
       .dark
       .dark-mode
       
       So CSS can use either.
    ===================================================== */

    const darkToggle =
        $("#darkToggle");


    const savedTheme =
        localStorage.getItem(
            "bs360-theme"
        );


    function applyTheme(theme) {

        const dark =
            theme === "dark";


        document.body.classList.toggle(
            "dark",
            dark
        );


        document.body.classList.toggle(
            "dark-mode",
            dark
        );


        if (darkToggle) {

            darkToggle.textContent =
                dark
                    ? "☀️"
                    : "🌙";

            darkToggle.setAttribute(
                "aria-label",
                dark
                    ? "Light mode"
                    : "Dark mode"
            );
        }
    }


    applyTheme(
        savedTheme === "dark"
            ? "dark"
            : "light"
    );


    if (darkToggle) {

        darkToggle.addEventListener(
            "click",
            () => {

                const dark =
                    document.body.classList.contains(
                        "dark"
                    );


                const newTheme =
                    dark
                        ? "light"
                        : "dark";


                applyTheme(
                    newTheme
                );


                localStorage.setItem(
                    "bs360-theme",
                    newTheme
                );
            }
        );
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle =
        $("#menuToggle");

    const navMenu =
        $("#navMenu");


    if (
        menuToggle &&
        navMenu
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle(
                    "open"
                );


                menuToggle.classList.toggle(
                    "active"
                );
            }
        );


        /* Close menu after clicking link */

        $$("#navMenu a").forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "open"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );
                }
            );
        });
    }


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                navMenu &&
                navMenu.classList.contains(
                    "open"
                )
            ) {

                navMenu.classList.remove(
                    "open"
                );


                menuToggle?.classList.remove(
                    "active"
                );
            }
        }
    );


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "===================================="
    );

    console.log(
        "BS 360 NEWS - NEW HOMEPAGE"
    );

    console.log(
        "All Articles:",
        allArticles.length
    );

    console.log(
        "Latest:",
        latestData.length
    );

    console.log(
        "Trending:",
        trendingData.length
    );

    console.log(
        "Most Read:",
        mostReadData.length
    );

    console.log(
        "Movies:",
        moviesData.length
    );

    console.log(
        "Sports:",
        sportsData.length
    );

    console.log(
        "AP & TS:",
        apTsData.length
    );

    console.log(
        "Business:",
        businessData.length
    );

    console.log(
        "Bigg Boss:",
        bigBossData.length
    );

    console.log(
        "===================================="
    );

});
