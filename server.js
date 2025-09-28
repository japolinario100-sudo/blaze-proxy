const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("Servidor online ✅");
});

// Rota para pegar histórico do Tipminer
app.get("/blaze", async (req, res) => {
  try {
    const response = await fetch("https://www.tipminer.com/br/historico/blaze/double?timezone=America%2FFortaleza&subject=filter&limit=100");
    const html = await response.text();

    // Expressão simples para capturar números de cores no HTML
    const regex = /<div class="color ball (.*?)">.*?<span>(\d+)<\/span>/g;
    let match;
    const results = [];

    while ((match = regex.exec(html)) !== null) {
      results.push({ color: match[1], number: match[2] });
    }

    res.json({ status: "ok", total: results.length, results });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Porta dinâmica para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
