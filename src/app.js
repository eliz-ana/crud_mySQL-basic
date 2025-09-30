import express, { json } from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 8080);
app.use(express.json());
// Ruta de ejemplo para verificar que el servidor funciona
app.get("/health", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT 1 as ok");
    res.json({
      status: "ok",
      db: rows[0].ok === 1 ? "connected" : "disconnected",
    });
  } catch (error) {
    next(error);
  }
});
// Ruta para obtener todos los productos
app.get("/api/products", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id,name,price, created_at FROM product ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});
// Ruta para crear un nuevo producto
app.post("/api/products", async (req, res, next) => {
  try {
    let { name, price } = req.body;
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: `name is required` });
    }
    price = Number(price);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: `price must be a positive number` });
    }
    const [result] = await pool.query(
      "INSERT INTO product (name, price) VALUES (?, ?)",
      [name.trim(), price]
    );
    const [rows] = await pool.query(
      "SELECT id,name,price, created_at FROM product WHERE id = ?",
      [result.insertId]
    );
    res.status(201).location(`/api/products/${result.insertId}`);
    json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// ruta para obtener un producto por ID
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const [rows] = await pool.query(
      "SELECT id,name,price, created_at FROM product WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// Manejo de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
