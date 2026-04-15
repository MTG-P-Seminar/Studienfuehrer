import { allDefined } from "/vendor/webawesome/dist-cdn/webawesome.js";

document.addEventListener("DOMContentLoaded", async () => {
  await allDefined();

  init();
});

function init() {
  const carousel = document.querySelector("wa-carousel");
  let startX, startY;

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  });

  carousel.addEventListener("touchmove", (e) => {
    const dx = e.touches[0].pageX - startX;
    const dy = e.touches[0].pageY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
    }
  }, { passive: false });

  carousel.addEventListener("wa-slide-change", () => {
    setTimeout(carousel.synchronizeSlides, 0)
  })

  document.querySelectorAll(".img-wrapper wa-button").forEach(el => {
    el.addEventListener("click", () => {
      const img = el.parentElement.querySelector("img")
      const overlay = document.getElementById("overlay")
      overlay.querySelector("img")?.remove()
      overlay.prepend(img.cloneNode(true))
      overlay.classList.add("img-overlay-visible")
    });
  });
  
  document.querySelectorAll(".img-overlay").forEach(el => {
    el.addEventListener("click", ev => {
      if (ev.target !== el.querySelector("img")) {
        el.classList.remove("img-overlay-visible")
      }
    });
  });
}
