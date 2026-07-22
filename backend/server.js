const express = require("express");
const path = require("node:path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/:page", (req, res) => {
  const page = req.params.page.toLowerCase();

  const filePath = path.join(__dirname, `../frontend/dist/pages/${page}`, "index.html");

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Page not found");
    }
  });
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, `../frontend/dist/pages/home`, "index.html");
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
