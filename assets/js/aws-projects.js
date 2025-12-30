(async function () {
  const list = document.querySelector(".project-list");
  if (!list) return;

  const RAW = window.__CONFIG__?.API_BASE || "";
  if (!RAW) {
    console.log("API_BASE not set; keeping static projects.");
    return;
  }

  const API_BASE = RAW.replace(/\/+$/, "").replace(/\/projects$/, "");

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) return;

    // Render DynamoDB projects
    list.innerHTML = projects
      .map((p) => {
        const title = p.title || "Untitled";
        const category = (p.category || "web development").toLowerCase().trim(); // IMPORTANT
        const url = p.url || "#";
        const image = p.image || "./assets/images/portfolio.jpg";

        const prettyCategory =
          category === "machine learning" ? "Machine Learning" : "Web development";

        return `
          <li class="project-item active" data-filter-item data-category="${category}">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              <figure class="project-img">
                <div class="project-item-icon-box">
                  <ion-icon name="eye-outline"></ion-icon>
                </div>
                <img src="${image}" alt="${title}" loading="lazy">
              </figure>

              <h3 class="project-title">${title}</h3>
              <p class="project-category">${prettyCategory}</p>
            </a>
          </li>
        `;
      })
      .join("");

    // Re-wire filtering for newly inserted items
    initProjectFiltering();
    applyFilter("All");
  } catch (e) {
    console.log("AWS projects fetch failed; keeping static projects.", e);
  }
})();

// --- Filtering (works even after dynamic DOM update) ---
function applyFilter(label) {
  const selected = (label || "all").toLowerCase().trim();
  const items = document.querySelectorAll(".project-item[data-filter-item]");
  const btns = document.querySelectorAll("[data-filter-btn]");
  const selectValue = document.querySelector("[data-selecct-value]"); // NOTE: typo exists in your HTML

  // highlight active button
  btns.forEach((b) => {
    const name = b.textContent.toLowerCase().trim();
    b.classList.toggle("active", name === selected);
  });

  // update dropdown label
  if (selectValue) selectValue.textContent = label;

  // show/hide items
  items.forEach((it) => {
    const cat = (it.dataset.category || "").toLowerCase().trim();
    const show = selected === "all" || cat === selected;
    it.classList.toggle("active", show);
  });
}

function initProjectFiltering() {
  const filterBtns = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const filterSelectBox = document.querySelector(".filter-select-box");
  const selectBtn = document.querySelector("[data-select]");

  // Optional: dropdown open/close
  if (selectBtn && filterSelectBox) {
    selectBtn.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation();
        filterSelectBox.classList.toggle("active");
      },
      true
    );
  }

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation(); // prevent old script.js handler from interfering
        const label = btn.textContent.trim();
        applyFilter(label);
      },
      true
    );
  });

  // Dropdown items
  selectItems.forEach((btn) => {
    btn.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation();
        const label = btn.textContent.trim();
        applyFilter(label);
        if (filterSelectBox) filterSelectBox.classList.remove("active");
      },
      true
    );
  });
}
