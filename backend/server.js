const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// 1. Statische Assets (CSS, JS, Bilder etc.)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 2. Dynamische Page-Routen
app.get("/:page", (req, res) => {
  const page = req.params.page;

  const filePath = path.join(
    __dirname,
    `../frontend/dist/pages/${page}`,
    `index.html`
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Page not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
