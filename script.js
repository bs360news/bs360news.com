/* =========================================================
   BS 360 NEWS - HOMEPAGE JAVASCRIPT
   FIXED CATEGORY + EXACT ARTICLE COUNTS

   SEPARATE ARTICLE SOURCES
   Latest       -> #latestNewsSource
   Trending     -> #trendingSource
   Most Read    -> #mostReadSource
   AP & TS      -> #aptsSource
   Sports       -> #sportsSource
   Entertainment -> #entertainmentSource
   Business     -> #businessSource

   OLD STRUCTURE + OLD STYLE PRESERVED
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    /* =====================================================
       MAIN OLD SOURCE
       OLD HTML COMPATIBILITY
    ===================================================== */

    const source =
        $("#legacyNewsSource");


    /* =====================================================
       READ ARTICLES FROM SOURCE
    ===================================================== */

    function readArticlesFromSource(sourceElement) {

        if (!sourceElement) {
            return [];
        }


        return $$(".news-item.post", sourceElement)
            .map(item => {

                const image =
                    $("img", item);

                const title =
                    $(".news-content p", item);


                return {

                    category:
                        (item.dataset.category || "")
                            .trim()
                            .toLowerCase(),

                    url:
                        item.dataset.url || "#",

                    image:
                        image
                            ? image.getAttribute("src")
                            : "",

                    alt:
                        image
                            ? (
                                image.getAttribute("alt") ||
                                ""
                            )
                            : "",

                    title:
                        title
                            ? title.textContent.trim()
                            : ""

                };

            })
            .filter(article =>
                article.title &&
                article.image
            );

    }


    /* =====================================================
       READ SEPARATE SOURCE
    ===================================================== */

    function readSeparateSource(id) {

        const separateSource =
            document.getElementById(id);


        if (!separateSource) {
            return [];
        }


        return readArticlesFromSource(
            separateSource
        );

    }


    /* =====================================================
       OLD LEGACY ARTICLES
    ===================================================== */

    const articles =
        source
            ? readArticlesFromSource(source)
            : [];


    console.log(
        "BS360 OLD ARTICLES LOADED:",
        articles.length
    );


    /* =====================================================
       CATEGORY NORMALIZER
    ===================================================== */

    function normalizeCategory(category) {

        const value =
            (category || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "");


        if (
            value === "ap" ||
            value === "ts" ||
            value === "apts" ||
            value === "ap/ts" ||
            value === "ap-ts" ||
            value === "ap&ts" ||
            value === "apandts"
        ) {

            return "apts";

        }


        if (
            value === "sports" ||
            value === "sport"
        ) {

            return "sports";

        }


        if (
            value === "cinema" ||
            value === "movies" ||
            value === "movie" ||
            value === "entertainment"
        ) {

            return "cinema";

        }


        if (
            value === "business" ||
            value === "businessnews"
        ) {

            return "business";

        }


        if (
            value === "bigboss10" ||
            value === "bigboss"
        ) {

            return "bigboss10";

        }


        return value;
    }


    /* =====================================================
       UNIQUE ARTICLES
    ===================================================== */

    function uniqueArticles(data) {

        const usedUrls =
            new Set();


        return data.filter(article => {

            const url =
                String(article.url || "")
                    .trim()
                    .toLowerCase();


            if (usedUrls.has(url)) {
                return false;
            }


            usedUrls.add(url);

            return true;

        });

    }


    /* =====================================================
       GET CATEGORY ARTICLES
    ===================================================== */

    function getCategoryArticles(category) {

        const used =
            new Set();


        return articles.filter(article => {

            const normalized =
                normalizeCategory(
                    article.category
                );


            if (
                normalized !== category
            ) {

                return false;

            }


            if (
                used.has(article.url)
            ) {

                return false;

            }


            used.add(article.url);

            return true;

        });

    }


    /* =====================================================
       CATEGORY DATA
       
       OLD STRUCTURE PRESERVED
    ===================================================== */

    let apTsArticles =
        getCategoryArticles("apts");


    let sportsArticles =
        getCategoryArticles("sports");


    let entertainmentArticles =
        getCategoryArticles("cinema");


    let businessArticles =
        getCategoryArticles("business");


    /* =====================================================
       SEPARATE CATEGORY SOURCES
       
       IF THEY EXIST, THEY WILL BE USED.
       
       OTHERWISE OLD LEGACY CATEGORY ARTICLES CONTINUE.
    ===================================================== */

    const separateApTs =
        readSeparateSource("aptsSource");


    const separateSports =
        readSeparateSource("sportsSource");


    const separateEntertainment =
        readSeparateSource(
            "entertainmentSource"
        );


    const separateBusiness =
        readSeparateSource(
            "businessSource"
        );


    if (separateApTs.length) {

        apTsArticles =
            uniqueArticles(
                separateApTs
            );

    }


    if (separateSports.length) {

        sportsArticles =
            uniqueArticles(
                separateSports
            );

    }


    if (separateEntertainment.length) {

        entertainmentArticles =
            uniqueArticles(
                separateEntertainment
            );

    }


    if (separateBusiness.length) {

        businessArticles =
            uniqueArticles(
                separateBusiness
            );

    }


    /* =====================================================
       NON BIGBOSS ARTICLES
       
       OLD STRUCTURE PRESERVED
    ===================================================== */

    const normalArticles =
        articles.filter(article =>
            normalizeCategory(
                article.category
            ) !== "bigboss10"
        );


    /* =====================================================
       LATEST NEWS
       
       IMPORTANT:
       Latest uses ONLY #latestNewsSource
       
       If source does not exist,
       OLD legacy behavior is used.
    ===================================================== */

    const latestTarget =
        $("#topStory");


    const separateLatest =
        readSeparateSource(
            "latestNewsSource"
        );


    function createLatestCard(article) {

        return `
            <a
                href="${article.url}"
                class="latest-news-card"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt || article.title}"
                    loading="lazy"
                >

                <h3>
                    ${article.title}
                </h3>

            </a>
        `;

    }


    function renderLatestNews() {

        if (!latestTarget) {
            return;
        }


        /*
         * Separate Latest source exists
         * -> ONLY those articles
         */

        let latestArticles;


        if (separateLatest.length) {

            latestArticles =
                uniqueArticles(
                    separateLatest
                ).slice(0, 6);

        }

        /*
         * Separate Latest source doesn't exist
         * -> OLD system continues
         */

        else {

            latestArticles =
                uniqueArticles(
                    normalArticles
                ).slice(0, 6);

        }


        if (!latestArticles.length) {

            latestTarget.innerHTML = `
                <p class="latest-empty">
                    తాజా వార్తలు అందుబాటులో లేవు
                </p>
            `;

            return;

        }


        latestTarget.innerHTML = `
            <div class="latest-news-grid">

                ${latestArticles
                    .map(createLatestCard)
                    .join("")}

            </div>
        `;

    }


    renderLatestNews();


    /* =====================================================
       CATEGORY BIG CARD
       
       SAME OLD DESIGN
    ===================================================== */

    function createCategoryFeature(article) {

        return `
            <a
                href="${article.url}"
                class="category-feature"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt || article.title}"
                    loading="lazy"
                >

                <div class="category-feature-content">

                    <h3>
                        ${article.title}
                    </h3>

                </div>

            </a>
        `;

    }


    /* =====================================================
       CATEGORY SMALL CARD
       
       SAME OLD DESIGN
    ===================================================== */

    function createCategoryCard(article) {

        return `
            <a
                href="${article.url}"
                class="category-card"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt || article.title}"
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


    /* =====================================================
       CATEGORY RENDER
       
       EXACTLY 5
       1 BIG + 4 SMALL

       SAME OLD STRUCTURE
    ===================================================== */

    function renderCategory(
        target,
        data
    ) {

        if (!target) {
            return;
        }


        const categoryArticles =
            uniqueArticles(data)
                .slice(0, 5);


        target.innerHTML = "";


        if (!categoryArticles.length) {

            target.innerHTML = `
                <p class="category-empty">
                    వార్తలు అందుబాటులో లేవు
                </p>
            `;

            return;
        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "category-news-layout";


        /* =================================================
           BIG ARTICLE
        ================================================= */

        wrapper.insertAdjacentHTML(
            "beforeend",
            createCategoryFeature(
                categoryArticles[0]
            )
        );


        /* =================================================
           4 SMALL ARTICLES
        ================================================= */

        categoryArticles
            .slice(1, 5)
            .forEach(article => {

                wrapper.insertAdjacentHTML(
                    "beforeend",
                    createCategoryCard(
                        article
                    )
                );

            });


        target.appendChild(wrapper);

    }


    /* =====================================================
       AP & TS
       ONLY AP & TS ARTICLES
    ===================================================== */

    renderCategory(
        $("#sliderTrack"),
        apTsArticles
    );


    /* =====================================================
       SPORTS
       ONLY SPORTS ARTICLES
    ===================================================== */

    renderCategory(
        $("#sportsGrid"),
        sportsArticles
    );


    /* =====================================================
       ENTERTAINMENT
       ONLY ENTERTAINMENT ARTICLES
    ===================================================== */

    renderCategory(
        $("#cinemaGrid"),
        entertainmentArticles
    );


    /* =====================================================
       BUSINESS
       ONLY BUSINESS ARTICLES
    ===================================================== */

    renderCategory(
        $("#businessGrid"),
        businessArticles
    );


    /* =====================================================
       AFTER MOST READ
       
       EXISTING STRUCTURE PRESERVED
    ===================================================== */

    function createThreeColumnCard(
        article
    ) {

        return `
            <a
                href="${article.url}"
                class="three-column-news-card"
            >

                <img
                    src="${article.image}"
                    alt="${article.alt || article.title}"
                    loading="lazy"
                >

                <h3>
                    ${article.title}
                </h3>

            </a>
        `;

    }


    function renderThreeColumnGrid(
        target,
        data
    ) {

        if (!target) {
            return;
        }


        const finalData =
            uniqueArticles(data)
                .slice(0, 9);


        target.innerHTML =
            finalData
                .map(
                    createThreeColumnCard
                )
                .join("");

    }


    renderThreeColumnGrid(
        $("#afterApTsGrid"),
        apTsArticles
    );


    renderThreeColumnGrid(
        $("#afterSportsGrid"),
        sportsArticles
    );


    renderThreeColumnGrid(
        $("#afterEntertainmentGrid"),
        entertainmentArticles
    );


    renderThreeColumnGrid(
        $("#afterBusinessGrid"),
        businessArticles
    );


    /* =====================================================
       TRENDING NEWS
       
       IMPORTANT:
       ONLY #trendingSource

       If separate source does NOT exist,
       EXISTING HTML CARDS ARE PRESERVED.

       JS WILL NOT MIX LATEST ARTICLES HERE.
    ===================================================== */

    const trendingTarget =
        $("#trendingGrid");


    const separateTrending =
        readSeparateSource(
            "trendingSource"
        );


    if (
        trendingTarget &&
        separateTrending.length
    ) {

        const trendingArticles =
            uniqueArticles(
                separateTrending
            ).slice(0, 12);


        trendingTarget.innerHTML =
            trendingArticles
                .map(article => {

                    return `
                        <a
                            href="${article.url}"
                            class="trending-card"
                        >

                            <img
                                src="${article.image}"
                                alt="${article.alt || article.title}"
                                loading="lazy"
                            >

                            <h3>
                                ${article.title}
                            </h3>

                        </a>
                    `;

                })
                .join("");

    }


    /* =====================================================
       MOST READ
       
       IMPORTANT:
       ONLY #mostReadSource

       If separate source does NOT exist,
       EXISTING HTML CARDS ARE PRESERVED.

       JS WILL NOT MIX LATEST ARTICLES HERE.
    ===================================================== */

    const mostReadTarget =
        $("#mostReadList");


    const separateMostRead =
        readSeparateSource(
            "mostReadSource"
        );


    if (
        mostReadTarget &&
        separateMostRead.length
    ) {

        const mostReadArticles =
            uniqueArticles(
                separateMostRead
            ).slice(0, 8);


        mostReadTarget.innerHTML =
            mostReadArticles
                .map(article => {

                    return `
                        <a
                            href="${article.url}"
                            class="most-read-item"
                        >

                            <div
                                class="most-read-text"
                            >

                                <h3>
                                    ${article.title}
                                </h3>

                            </div>

                            <img
                                src="${article.image}"
                                alt="${article.alt || article.title}"
                                loading="lazy"
                            >

                        </a>
                    `;

                })
                .join("");

    }


    /* =====================================================
       PHOTO GALLERY
       
       OLD FUNCTION PRESERVED
    ===================================================== */

    const photoTarget =
        $("#photoGallery");


    if (photoTarget) {

        const photoArticles =
            uniqueArticles(
                normalArticles
            ).slice(0, 8);


        photoTarget.innerHTML =
            photoArticles
                .map(article => {

                    return `
                        <a
                            href="${article.url}"
                            class="photo-gallery-card"
                        >

                            <img
                                src="${article.image}"
                                alt="${article.alt || article.title}"
                                loading="lazy"
                            >

                            <h3>
                                ${article.title}
                            </h3>

                        </a>
                    `;

                })
                .join("");

    }


    /* =====================================================
       VIDEO NEWS
       
       OLD FUNCTION PRESERVED
    ===================================================== */

    const videoTarget =
        $("#videoNewsGrid");


    if (videoTarget) {

        const videoArticles =
            uniqueArticles(
                normalArticles
            ).slice(0, 6);


        videoTarget.innerHTML =
            videoArticles
                .map(article => {

                    return `
                        <a
                            href="${article.url}"
                            class="video-news-card"
                        >

                            <div
                                class="video-thumbnail"
                            >

                                <img
                                    src="${article.image}"
                                    alt="${article.alt || article.title}"
                                    loading="lazy"
                                >

                                <span
                                    class="video-play"
                                >
                                    ▶
                                </span>

                            </div>

                            <h3>
                                ${article.title}
                            </h3>

                        </a>
                    `;

                })
                .join("");

    }


    /* =====================================================
       SEARCH OPEN / CLOSE
       
       OLD FUNCTION
    ===================================================== */

    window.toggleSearch =
        function () {

            const box =
                $("#searchBox");


            if (!box) {
                return;
            }


            box.classList.toggle(
                "show"
            );


            if (
                box.classList.contains(
                    "show"
                )
            ) {

                const input =
                    $("#searchInput");


                if (input) {

                    setTimeout(
                        () =>
                            input.focus(),
                        100
                    );

                }

            }

        };


    /* =====================================================
       SEARCH NEWS
       
       SEARCH ALL ARTICLES
    ===================================================== */

    window.searchNews =
        function () {

            const input =
                $("#searchInput");


            if (!input) {
                return;
            }


            const query =
                input.value
                    .trim()
                    .toLowerCase();


            if (!query) {
                return;
            }


            /*
             * Include separate source articles
             * also in search.
             */

            const allSearchArticles =
                uniqueArticles([

                    ...articles,

                    ...separateLatest,

                    ...separateTrending,

                    ...separateMostRead,

                    ...separateApTs,

                    ...separateSports,

                    ...separateEntertainment,

                    ...separateBusiness

                ]);


            const result =
                allSearchArticles.find(
                    article =>
                        article.title
                            .toLowerCase()
                            .includes(query)
                );


            if (result) {

                window.location.href =
                    result.url;

            } else {

                alert(
                    "ఈ వార్త ప్రస్తుతం అందుబాటులో లేదు."
                );

            }

        };


    /* =====================================================
       SEARCH ENTER
    ===================================================== */

    const searchInput =
        $("#searchInput");


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    window.searchNews();

                }

            }
        );

    }


    /* =====================================================
       DARK MODE
       OLD FUNCTION
    ===================================================== */

    window.toggleTheme =
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const button =
                $("#themeButton");


            if (!button) {
                return;
            }


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                button.textContent =
                    "☀️ Light";


                localStorage.setItem(
                    "bs360-theme",
                    "dark"
                );

            } else {

                button.textContent =
                    "🌙 Dark";


                localStorage.setItem(
                    "bs360-theme",
                    "light"
                );

            }

        };


    /* =====================================================
       LOAD SAVED THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "bs360-theme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        const button =
            $("#themeButton");


        if (button) {

            button.textContent =
                "☀️ Light";

        }

    }


    /* =====================================================
       MOBILE NAV
       OLD FUNCTION
    ===================================================== */

    window.toggleMobileNav =
        function () {

            const nav =
                $("#navLinks");


            if (!nav) {
                return;
            }


            nav.classList.toggle(
                "mobile-open"
            );

        };


    /* =====================================================
       ESC KEY
       OLD FUNCTION
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            const search =
                $("#searchBox");


            if (
                search &&
                search.classList.contains(
                    "show"
                )
            ) {

                search.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       DEBUG
       
       CHECK WHICH SECTIONS HAVE ARTICLES
    ===================================================== */

    console.log(
        "========================================"
    );

    console.log(
        "BS360 SEPARATE ARTICLE SYSTEM"
    );

    console.log(
        "Latest:",
        separateLatest.length
            ? separateLatest.length
            : "OLD LEGACY"
    );

    console.log(
        "Trending:",
        separateTrending.length
            ? separateTrending.length
            : "HTML CARDS"
    );

    console.log(
        "Most Read:",
        separateMostRead.length
            ? separateMostRead.length
            : "HTML CARDS"
    );

    console.log(
        "AP & TS:",
        apTsArticles.length
    );

    console.log(
        "Sports:",
        sportsArticles.length
    );

    console.log(
        "Entertainment:",
        entertainmentArticles.length
    );

    console.log(
        "Business:",
        businessArticles.length
    );

    console.log(
        "========================================"
    );


});
