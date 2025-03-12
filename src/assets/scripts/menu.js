document.addEventListener('DOMContentLoaded', () => {
  const menuList = document.querySelector("#menu__list");
  const menuButton = document.querySelector("#menuButton");
  
  if (!menuList || !menuButton) return;
  
  // Функция переключения меню
  const toggleMenu = (open = null) => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    const newState = open !== null ? open : !isExpanded;
    
    menuButton.setAttribute("aria-expanded", newState);
    menuButton.classList.toggle("menu__button--open", newState);
    menuList.classList.toggle("menu__header--open", newState);
  };
  
  // Обработчик клика по кнопке меню
  menuButton.addEventListener("click", () => toggleMenu());
  
  // Закрытие меню при клике вне его области
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#menu__list") && 
        !e.target.closest("#menuButton") && 
        menuButton.getAttribute("aria-expanded") === "true") {
      toggleMenu(false);
    }
  }, { passive: true });
});