
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

[
  ".homepage-news-layout",
  ".top-news-group",
  ".latest-trending-layout",
  "#latestSection",
  "#trendingSection",
  "#entertainmentSection"
].map(s => {
  const e = document.querySelector(s);
  if (!e) return { section: s, missing: true };
  const r = e.getBoundingClientRect();
  const c = getComputedStyle(e);
  return {
    section: s,
    top: Math.round(r.top + scrollY),
    height: Math.round(r.height),
    marginTop: c.marginTop,
    marginBottom: c.marginBottom,
    display: c.display,
    position: c.position
  };
});

