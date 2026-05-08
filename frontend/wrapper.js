const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src/pages");
const DIST_DIR = path.join(__dirname, "dist/pages");
const WRAPPER_PATH = path.join(__dirname, "wrapper.html");
const VENDOR_SRC = path.join(__dirname, "src/vendor");
const VENDOR_DIST = path.join(__dirname, "dist/vendor");
const GLOBAL_SRC = path.join(__dirname, "src/global");
const GLOBAL_DIST = path.join(__dirname, "dist/global");
const ASSETS_SRC = path.join(__dirname, "src/assets");
const ASSETS_DIST = path.join(__dirname, "dist/assets");

const titles = {
  leni: "Leni",
  showcase: "Showcase",
  tum: "TUM",
  yubikey: "YubiKey"
}

// Wrapper laden
const wrapperTemplate = fs.readFileSync(WRAPPER_PATH, "utf-8");

// Hilfsfunktion: Inhalt aus <body> extrahieren
function extractContent(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

// Ordner rekursiv kopieren
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// --- VENDOR kopieren ---
copyFolderRecursive(VENDOR_SRC, VENDOR_DIST);
console.log("✔ Vendor copied");

// --- GLOBAL kopieren ---
copyFolderRecursive(GLOBAL_SRC, GLOBAL_DIST);
console.log("✔ Global copied");

// --- Assets kopieren ---
copyFolderRecursive(ASSETS_SRC, ASSETS_DIST);
console.log("✔ Assets copied");

// --- Pages verarbeiten ---
fs.readdirSync(SRC_DIR).forEach((page) => {
  const pagePath = path.join(SRC_DIR, page);
  const stat = fs.statSync(pagePath);

  if (!stat.isDirectory()) return;

  const distPagePath = path.join(DIST_DIR, page);
  fs.mkdirSync(distPagePath, { recursive: true });

  const htmlPath = path.join(pagePath, "index.html");
  const jsPath = path.join(pagePath, "index.js");
  const cssPath = path.join(pagePath, "index.css");

  // JS & CSS kopieren
  if (fs.existsSync(jsPath)) {
    fs.copyFileSync(jsPath, path.join(distPagePath, "index.js"));
  }

  if (fs.existsSync(cssPath)) {
    fs.copyFileSync(cssPath, path.join(distPagePath, "index.css"));
  }

  // HTML verarbeiten
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");
    const extracted = extractContent(htmlContent);

    if (process.env.GITHUB_ACTIONS === "true") {
      console.log("läuft in GitHub Actions");
    }
    const BASE_PATH = process.env.GITHUB_ACTIONS === "true" ? `/${process.env.GITHUB_REPOSITORY}/`: "/"

    const finalHtml = wrapperTemplate.replaceAll("${BASE_PATH}", BASE_PATH).replace(
      /<main[^>]*>[\s\S]*?<\/main>/i,
      `<main class="container wa-stack">\n${extracted}\n</main>`
    )
    .replace(
      /<\/head>/i,
      `<link rel="stylesheet" href="${BASE_PATH}pages/${page}/index.css">\n</head>
       <title>${titles[page]} · StAu MTG</title>`
    )
    .replace(
      /<\/body>/i,
      `  <script src="${BASE_PATH}pages/${page}/index.js" type="module"></script>\n</body>`
    );;

    fs.writeFileSync(
      path.join(distPagePath, "index.html"),
      finalHtml,
      "utf-8"
    );
  }

  console.log(`✔ Processed: ${page}`);
});
