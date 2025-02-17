require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("knex");
const path = require("path");

const db = knex(require("./knexfile.js"));
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.get("/businesses", async (req, res) => {
  try {
    const businesses = await db("businesses").select("*");
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener negocios" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await db("products").select("*");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Iniciar el servidor
const PORT = process.env.DB_PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
