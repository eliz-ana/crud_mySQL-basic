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

// Valida ?limit, ?page, ?q, ?minPrice, ?maxPrice
export function validatePaginationAndFilters(req, res, next) {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const page  = req.query.page  ? Number(req.query.page)  : 1;

  if (!Number.isInteger(limit) || limit <= 0 || limit > 100)
    return res.status(400).json({ error: "limit must be an integer 1..100" });
  if (!Number.isInteger(page) || page <= 0)
    return res.status(400).json({ error: "page must be >= 1" });

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0))
    return res.status(400).json({ error: "minPrice must be a positive number" });
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
    return res.status(400).json({ error: "maxPrice must be a positive number" });
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    return res.status(400).json({ error: "minPrice must be <= maxPrice" });

  req.filters = { limit, offset: (page - 1) * limit, q, minPrice, maxPrice, page };
  next();
}