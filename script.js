
/* BS 360 NEWS - Homepage JavaScript */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  function readArticlesFromSource(element) {
    if (!element) return [];

    return $$(".news-item.post", element)
      .map(function (item) {
        const image = $("img", item);
        const title = $(".news-content p", item);

        return {
          category: (item.dataset.category || "").trim().toLowerCase(),
          url: item.dataset.url || "#",
          image: image ? image.getAttribute("src") : "",
          alt: image ? image.getAttribute("alt") || "" : "",
          title: title ? title.textContent.trim() : ""
        };
      })
      .filter(article => article.title && article.image);
  }

  const readSource = id =>
    readArticlesFromSource(document.getElementById(id));

  const legacySource = $("#legacyNewsSource");
  const articles = readArticlesFromSource(legacySource);

  const latestArticles = readSource("latestNewsSource");
  const trendingArticles = readSource("trendingSource");
  const mostReadArticles = readSource("mostReadSource");
  const apTsArticles = readSource("aptsSource");
  const sportsArticles = readSource("sportsSource");
  const entertainmentArticles = readSource("entertainmentSource");
  const businessArticles = readSource("businessSource");

  function uniqueArticles(list) {
    const seen = new Set();

    return list.filter(article => {
      const key = (article.url || "").trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function createCard(article, className) {
    return `
      <a class="${className}" href="${escapeHTML(article.url)}">
        <img
          src="${escapeHTML(article.image)}"
          alt="${escapeHTML(article.alt || article.title)}"
          loading="lazy">
        <h3>${escapeHTML(article.title)}</h3>
      </a>`;
  }

  // తాజా వార్తలు
  const latestTarget = $("#topStory");

  if (latestTarget) {
    const list = uniqueArticles(
      latestArticles.length ? latestArticles : articles
    ).slice(0, 9);

    latestTarget.innerHTML = list.length
      ? `<div class="latest-news-grid">
          ${list.map(article =>
            createCard(article, "latest-news-card")
          ).join("")}
        </div>`
      : "<p>తాజా వార్తలు త్వరలో అందుబాటులో ఉంటాయి.</p>";
  }

  // విభాగాల వార్తలు
  function renderCategory(target, list) {
    if (!target) return;

    list = uniqueArticles(list).slice(0, 5);

    if (!list.length) {
      target.innerHTML =
        "<p class='category-empty'>వార్తలు అందుబాటులో లేవు.</p>";
      return;
    }

    const feature = article => `
      <a href="${escapeHTML(article.url)}" class="category-feature">
        <img src="${escapeHTML(article.image)}"
             alt="${escapeHTML(article.alt || article.title)}"
             loading="lazy">
        <div class="category-feature-content">
          <h3>${escapeHTML(article.title)}</h3>
        </div>
      </a>`;

    const small = article => `
      <a href="${escapeHTML(article.url)}" class="category-card">
        <img src="${escapeHTML(article.image)}"
             alt="${escapeHTML(article.alt || article.title)}"
             loading="lazy">
        <div class="category-card-content">
          <h3>${escapeHTML(article.title)}</h3>
        </div>
      </a>`;

    target.innerHTML = `
      <div class="category-news-layout">
        ${feature(list[0])}
        ${list.slice(1).map(small).join("")}
      </div>`;
  }

  renderCategory($("#sliderTrack"), apTsArticles);
  renderCategory($("#sportsGrid"), sportsArticles);
  renderCategory($("#cinemaGrid"), entertainmentArticles);
  renderCategory($("#businessGrid"), businessArticles);

  // అదనపు వార్తల గ్రిడ్
  function renderGrid(target, list, className, limit = 8) {
    if (!target) return;

    target.innerHTML = uniqueArticles(list)
      .slice(0, limit)
      .map(article => createCard(article, className))
      .join("");
  }

  renderGrid($("#afterApTsGrid"), apTsArticles, "three-column-news-card");
  renderGrid($("#afterSportsGrid"), sportsArticles, "three-column-news-card");
  renderGrid(
    $("#afterEntertainmentGrid"),
    entertainmentArticles,
    "three-column-news-card"
  );
  renderGrid(
    $("#afterBusinessGrid"),
    businessArticles,
    "three-column-news-card"
  );

  // ట్రెండింగ్ వార్తలు
  renderGrid($("#trendingGrid"), trendingArticles, "trending-card", 12);

  // ఎక్కువ మంది చదివిన వార్తలు
  const mostReadTarget = $("#mostReadList");

  if (mostReadTarget) {
    mostReadTarget.innerHTML = uniqueArticles(mostReadArticles)
      .slice(0, 8)
      .map(article => `
        <a href="${escapeHTML(article.url)}" class="most-read-item">
          <div class="most-read-text">
            <h3>${escapeHTML(article.title)}</h3>
          </div>
          <img src="${escapeHTML(article.image)}"
               alt="${escapeHTML(article.alt || article.title)}"
               loading="lazy">
        </a>`)
      .join("");
  }

  // ఫోటో గ్యాలరీ
  renderGrid($("#photoGallery"), articles, "photo-gallery-card", 8);

  // వీడియో వార్తల విభాగం
  const videoTarget = $("#videoNewsGrid");

  if (videoTarget) {
    videoTarget.innerHTML = articles.slice(0, 6)
      .map(article => `
        <a href="${escapeHTML(article.url)}" class="video-news-card">
          <div class="video-thumbnail">
            <img src="${escapeHTML(article.image)}"
                 alt="${escapeHTML(article.alt || article.title)}"
                 loading="lazy">
          </div>
          <h3>${escapeHTML(article.title)}</h3>
        </a>`)
      .join("");
  }

  // AP & TS స్లయిడర్
  const slider = $("#newsSlider");

  $("#sliderPrev")?.addEventListener("click", function () {
    slider?.scrollBy({
      left: -(slider.clientWidth * 0.8),
      behavior: "smooth"
    });
  });

  $("#sliderNext")?.addEventListener("click", function () {
    slider?.scrollBy({
      left: slider.clientWidth * 0.8,
      behavior: "smooth"
    });
  });

  // సెర్చ్
  window.toggleSearch = function () {
    const box = $("#searchBox");
    if (!box) return;

    box.classList.toggle("show");

    if (box.classList.contains("show")) {
      $("#searchInput")?.focus();
    }
  };

  window.searchNews = function () {
    const input = $("#searchInput");
    if (!input) return;

    const query = input.value.trim().toLowerCase();
    if (!query) return;

    const allArticles = uniqueArticles([
      ...articles,
      ...latestArticles,
      ...trendingArticles,
      ...mostReadArticles,
      ...apTsArticles,
      ...sportsArticles,
      ...entertainmentArticles,
      ...businessArticles
    ]);

    const match = allArticles.find(article =>
      article.title.toLowerCase().includes(query)
    );

    if (match) {
      window.location.href = match.url;
    } else {
      alert("ఈ వార్త ప్రస్తుతం అందుబాటులో లేదు.");
    }
  };

  $("#searchInput")?.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      window.searchNews();
    }
  });

  // డార్క్ మోడ్
  const themeButton = $("#themeButton") || $("#themeToggle");

  function updateThemeButton() {
    if (!themeButton) return;

    const isDark = document.body.classList.contains("dark-mode");
    themeButton.textContent = isDark ? "లైట్ మోడ్" : "డార్క్ మోడ్";
  }

  window.toggleTheme = function () {
    document.body.classList.toggle("dark-mode");

    try {
      localStorage.setItem(
        "bs360-theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
    } catch (error) {}

    updateThemeButton();
  };

  try {
    if (localStorage.getItem("bs360-theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  } catch (error) {}

  updateThemeButton();

  themeButton?.addEventListener("click", window.toggleTheme);

  // మొబైల్ నావిగేషన్
  window.toggleMobileNav = function () {
    $("#navLinks")?.classList.toggle("mobile-open");
  };

  // Escape నొక్కితే సెర్చ్ మూసివేయాలి
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      $("#searchBox")?.classList.remove("show");
    }
  });
});
