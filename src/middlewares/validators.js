// src/middlewares/validators.js

// Valida :id de la ruta
export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  req.id = id; // lo guardamos para usar después
  next();
}

// Valida body { name, price } para POST/PUT
export function validateProductBody(req, res, next) {
  let { name, price } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  price = Number(price);
  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({ error: "price must be a positive number" });
  }

  // normalizamos valores
  req.productData = { name: name.trim(), price };
  next();
}
