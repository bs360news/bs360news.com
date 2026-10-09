
/* ==========================================
   BS360 NEWS - HOMEPAGE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 1. SEARCH NEWS
  const searchInputs = document.querySelectorAll(
    ".header-search input, .search-box input, " +
    ".search-form input, #newsSearch, #searchInput"
  );

  const searchableItems = document.querySelectorAll(
    ".news-item, .post, .news-card, .article-card"
  );

  let status = document.querySelector(".search-status");

  if (!status && searchableItems.length) {
    status = document.createElement("div");
    status.className = "search-status";
    status.hidden = true;

    const main = document.querySelector(
      ".main-content, .content-area, .news-main, main"
    );

    if (main) main.prepend(status);
  }

  function searchNews(value) {
    const query = value.trim().toLocaleLowerCase("te-IN");
    let count = 0;

    searchableItems.forEach(function (item) {
      const text = (
        item.innerText ||
        item.textContent ||
        ""
      ).toLocaleLowerCase("te-IN");

      const matches = !query || text.includes(query);

      item.classList.toggle("search-hidden", !matches);

      if (matches) count++;
    });

    if (status) {
      status.hidden = !query;
      status.textContent = query
        ? count + " వార్తలు కనిపిస్తున్నాయి."
        : "";
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      searchInputs.forEach(function (other) {
        if (other !== input) other.value = input.value;
      });

      searchNews(input.value);
    });

    const form = input.closest("form");

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        searchNews(input.value);
      });
    }
  });

  // 2. BREAKING NEWS TICKER
  const ticker = document.querySelector(
    ".ticker-track, .breaking-content"
  );

  if (ticker && !ticker.dataset.initialized) {
    ticker.dataset.initialized = "true";

    const originalText = ticker.innerHTML;

    if (ticker.scrollWidth > ticker.parentElement.clientWidth) {
      ticker.classList.add("is-moving");

      if (ticker.classList.contains("ticker-track")) {
        ticker.innerHTML += originalText;
      }
    }
  }

  // 3. CATEGORY FILTER
  const categoryButtons = document.querySelectorAll(
    "[data-filter], [data-category-filter]"
  );

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const category =
        button.dataset.filter ||
        button.dataset.categoryFilter;

      if (!category) return;

      document.querySelectorAll(
        ".news-item, .post, .news-card, .article-card"
      ).forEach(function (item) {
        const itemCategory =
          item.dataset.category || "";

        const matches =
          category === "all" ||
          itemCategory.toLowerCase() === category.toLowerCase();

        item.classList.toggle("filter-hidden", !matches);
      });

      categoryButtons.forEach(function (other) {
        other.classList.toggle("active", other === button);
      });
    });
  });

  // 4. NEWS CARD CLICK
  document.querySelectorAll(
    ".news-item, .post, .news-card, .article-card"
  ).forEach(function (card) {
    const link = card.querySelector("a[href]");

    if (link) {
      card.style.cursor = "pointer";

      card.addEventListener("click", function (event) {
        if (event.target.closest("a, button, input")) return;

        window.location.href = link.href;
      });
    }
  });

  // 5. AUTOMATIC TRENDING NUMBERS
  document.querySelectorAll(
    ".trending-list, #trendingSidebar"
  ).forEach(function (list) {
    const items = list.querySelectorAll(
      ".news-item, li"
    );

    items.forEach(function (item, index) {
      const number = item.querySelector(".trending-number");

      if (number) {
        number.textContent = index + 1;
      }
    });
  });

  // 6. MOBILE MENU TOGGLE
  const menuButton = document.querySelector(
    "#menuToggle, .menu-toggle, [data-menu-toggle]"
  );

  const navigation = document.querySelector(
    ".main-nav, .navbar, nav"
  );

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const isOpen =
        navigation.classList.toggle("menu-open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  // 7. REMOVE EMPTY NEWS SECTIONS
  // A section is hidden only if its known news containers
  // exist and all of them are empty.
  const sectionPairs = [
    ["#latestSection", "#latestGrid"],
    ["#sportsSection", "#sportsGrid"],
    ["#cinemaSection", "#cinemaGrid"],
    ["#businessSection", "#businessGrid"],
    ["#aptsSection", "#aptsGrid"]
  ];

  sectionPairs.forEach(function (pair) {
    const section = document.querySelector(pair[0]);
    const grid = document.querySelector(pair[1]);

    if (!section || !grid) return;

    const hasNews = grid.querySelector(
      ".news-item, .post, .news-card, .article-card"
    );

    if (!hasNews) {
      section.classList.add("section-empty");
    } else {
      section.classList.remove("section-empty");
    }
  });
});
