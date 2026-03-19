import { registerIconLibrary } from '/vendor/webawesome/dist-cdn/webawesome.js';

registerIconLibrary('default', {
  resolver: (name, _, variant) => {
    return `/vendor/fontawesome/svgs/${variant ?? "solid"}/${name}.svg`;
  },
});

const updateColorTheme = () => document.getElementsByTagName("html")[0].classList.toggle("wa-dark", colorThemeMedia.matches)
const colorThemeMedia = globalThis.matchMedia("(prefers-color-scheme: dark)")
colorThemeMedia.addEventListener("change", updateColorTheme)
updateColorTheme()

document.querySelectorAll("wa-dropdown").forEach(dd => {
  dd.addEventListener("wa-select", (event) => {
    if (event.detail.item.type == "checkbox") event.preventDefault();
  });
})

document.querySelectorAll("wa-dropdown-item:has([slot='submenu'])").forEach(di => {
  di.addEventListener("pointerenter", ev => {
    setTimeout(() => {
      const sm = di.shadowRoot?.getElementById("submenu")
      if (!sm) return
      if (sm.getBoundingClientRect().right > window.innerWidth - 8) {
        sm.style.right = "8px";
        sm.style.width = "auto"
      }
    }, 100)
  });
})
