import express, { json } from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { validateId, validateProductBody } from "./middlewares/validators.js";
import { asyncHandler } from "./utils/asyncHandler.js";


dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 8080);
app.use(express.json());
// Ruta de ejemplo para verificar que el servidor funciona
app.get("/health", asyncHandler(async (req, res, next) => {
  const [rows]=await pool.query("SELECT 1 AS ok");
  res.json({ status: "ok", db: rows[0].ok === 1 ? "connected" : "disconnected" });

 }));
// Ruta para obtener todos los productos
app.get("/api/products", asyncHandler(async (req, res, next) => {
  const [rows] = await pool.query(
    "SELECT id,name,price, created_at FROM product ORDER BY id DESC"
  );
  res.json(rows);
}));
// Ruta para crear un nuevo producto
app.post("/api/products", validateProductBody, asyncHandler(async (req, res, next) => {
  const { name, price } = req.productData;

  const [result] = await pool.query(
      "INSERT INTO product (name, price) VALUES (?, ?)",
      [name, price]
    );

    const [rows] = await pool.query(
      "SELECT id,name,price, created_at FROM product WHERE id = ?",
      [result.insertId]
    );

    res
      .status(201)
      .location(`/api/products/${result.insertId}`)
      .json(rows[0]);
 
}));

// ruta para actualizar un producto por ID
app.put(
  "/api/products/:id",
  validateId,
  validateProductBody,asyncHandler(async(req,res,next)=>{
    const {name,price}=req.productData;

    const [result]= await pool.query("UPDATE product SET name=?, price=? WHERE id=?",[name,price,req.id]);
    if(result.affectedRows===0)return res.status(404).json({error:"Product not found"});

    const [rows]= await pool.query("SELECT id,name,price, created_at FROM product WHERE id=?",[req.id]);

    res.json(rows[0]);

    }));
// ruta para eliminar un producto por ID
app.delete("/api/products/:id", validateId, asyncHandler(async (req, res) => {
  // 1) Traigo el producto (para devolverlo después)
  const [rows] = await pool.query(
    "SELECT id,name,price,created_at FROM product WHERE id = ?",
    [req.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  const deleted = rows[0];

  // 2) Borro
  const [result] = await pool.query("DELETE FROM product WHERE id = ?", [req.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // 3) Devuelvo lo que había
  res.status(200).json({
    message: "Deleted",
    item: deleted,
  });
}));


// ruta para obtener un producto por ID
app.get("/api/products/:id", validateId, asyncHandler(async (req, res, next) => {
  const [rows] = await pool.query(
    "SELECT id,name,price, created_at FROM product WHERE id = ?",
    [req.id]
  );
  if (rows.length === 0)
    return res.status(404).json({ error: "Product not found" });
  res.json(rows[0]);
}));




// manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// Manejo de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error"
  });
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
