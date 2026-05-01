const siteMenuButton = document.querySelector(".menu-button");
const siteMainNav = document.querySelector(".main-nav");

if (siteMenuButton && siteMainNav) {
  siteMenuButton.addEventListener("click", () => {
    const isOpen = siteMainNav.classList.toggle("open");
    siteMenuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteMainNav.addEventListener("click", () => {
    siteMainNav.classList.remove("open");
    siteMenuButton.setAttribute("aria-expanded", "false");
  });
}
