// Preload runs in a sandboxed context.
// No Node APIs are exposed to the renderer — the web app runs as-is.
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-electron", "true");

  // Push content down so macOS traffic lights don't overlap the app header.
  // titleBarStyle "hiddenInset" floats the lights over web content — this clears them.
  const style = document.createElement("style");
  style.textContent = `
    html[data-electron="true"] {
      padding-top: 36px !important;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
});
