(async function () {
  const list = document.querySelector(".project-list");
  if (!list) return;

  const API_BASE = window.__CONFIG__.API_BASE; // e.g. https://abc.execute-api.us-west-2.amazonaws.com

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) return;

    // Only replace the UI if valid data exists (prevents breaking the site)
    const html = projects.map(p => {
      const title = p.title || "Untitled";
      const category = (p.category || "web development").toLowerCase(); // must match your filter categories
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
    }).join("");

    list.innerHTML = html; // ✅ replaces all hardcoded projects with DynamoDB projects
  } catch (e) {
    // ✅ Safe fallback: do nothing, keep your current hardcoded projects
    console.log("AWS projects fetch failed; keeping static projects.", e);
  }
})();
