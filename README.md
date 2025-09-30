CRUD MySQL · Node.js + Express

Pequeño CRUD de products usando MySQL (mysql2/promise) y Express. Incluye validaciones, middlewares reutilizables y manejo centralizado de errores.

🧱 Tecnologías

Node.js, Express
mysql2 (pool de conexiones)
dotenv
nodemon (dev)

🚀 Puesta en marcha
Clonar e instalar
npm install

  Base de datos (MySQL Workbench/CLI)
  
CREATE DATABASE IF NOT EXISTS shop_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE shop_db;

CREATE TABLE IF NOT EXISTS product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO product (name, price) VALUES
('Keyboard', 25.99), ('Mouse', 14.50), ('Monitor 24"', 120.00);

🧪 Validaciones

id debe ser entero > 0 (validateId).
name string no vacío.
price número > 0 (validateProductBody).
Errores centralizados con middleware (retorna { error: msg }).

📁 Estructura
src/
  app.js
  db.js
  middlewares/
    validators.js
  utils/
    asyncHandler.js
.env
.gitignore
package.json
