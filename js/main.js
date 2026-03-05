async function loadComponents(root = document) {
  const placeholders = Array.from(root.querySelectorAll("[data-component]"));

  for (const node of placeholders) {
    const source = node.getAttribute("data-component");
    if (!source) {
      continue;
    }

    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${source}`);
      }

      node.innerHTML = await response.text();
      node.removeAttribute("data-component");
      await loadComponents(node);
    } catch (error) {
      node.innerHTML = `<!-- Component load error: ${source} -->`;
      console.error(error);
    }
  }
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  setCurrentYear();

  const initNavigation =
    typeof window.initNavigation === "function" ? window.initNavigation : () => {};
  const initAnimations =
    typeof window.initAnimations === "function"
      ? window.initAnimations
      : typeof window.initRevealAnimations === "function"
      ? window.initRevealAnimations
      : () => {};
  const initInteractions =
    typeof window.initInteractions === "function" ? window.initInteractions : () => {};

  initNavigation();
  initAnimations();
  initInteractions();
});
