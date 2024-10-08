document.addEventListener('DOMContentLoaded', function() {
    const menuList = document.querySelector("#menu__list");
    const menuButton = document.querySelector("#menuButton");

    if (!menuList || !menuButton) {
     // console.error("Menu list or menu button not found");
      return;
  }

  // console.log("Menu list and button found");
  
    function mobileMenu() {     
      let expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", !expanded);
      menuButton.classList.toggle("menu__button--open");
      menuList.classList.toggle("menu__header--open");
     // console.log("Menu toggled");
    }
  
    menuButton.addEventListener("click", mobileMenu);
  
    window.addEventListener("click", (e) => {
      
      const target = e.target;
      if (!target.closest("#menu__list") && !target.closest("#menuButton")) {
        let expanded = menuButton.getAttribute("aria-expanded") === "true";
        if (expanded) {
         
          menuButton.setAttribute("aria-expanded", false);
          menuList.classList.remove("menu__header--open");
          menuButton.classList.remove("menu__button--open");
         // console.log("Menu closed by clicking outside");
        }
      }
    });
  });
  