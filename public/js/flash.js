  // Wait until the DOM is loaded
  window.addEventListener("DOMContentLoaded", () => {
    const flash = document.querySelector(".flash-message");
    if (flash) {
      setTimeout(() => {
        flash.style.display = "none";
      }, 3000); 
    }
  });
