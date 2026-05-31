const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data', 'seed.json');
app.use(helmet());
app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173']; 
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://mercapp-flores.netlify.app'
  ],
  credentials: true
}));

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (error) {
    return { categories: [], products: [] };
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

app.get('/api/categories', (req, res) => {
  const db = readData();
  res.json(db.categories);
});

app.get('/api/products', (req, res) => {
  const db = readData();
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readData();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl, categoryId, stock } = req.body;

  if (!name || !price || !categoryId || stock === undefined) {
    return res.status(400).json({ message: "Error: Faltan campos obligatorios" });
  }
  if (Number(price) <= 0) {
    return res.status(400).json({ message: "Error: El precio debe ser mayor a 0" });
  }
  if (Number(stock) < 0) {
    return res.status(400).json({ message: "Error: El stock no puede ser negativo" });
  }

  const db = readData();
  const newProduct = {
    id: Date.now().toString(),
    name,
    description: description || "",
    price: Number(price),
    imageUrl: imageUrl || "https://via.placeholder.com/150",
    categoryId,
    stock: Number(stock)
  };

  db.products.push(newProduct);
  writeData(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = readData();
  const index = db.products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Producto no encontrado para actualizar" });
  }

  const { name, description, price, imageUrl, categoryId, stock } = req.body;

  if (!name || !price || !categoryId || stock === undefined) {
    return res.status(400).json({ message: "Error: Campos obligatorios vacíos" });
  }
  if (Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({ message: "Error: Valores numéricos inválidos" });
  }

  db.products[index] = {
    id: req.params.id,
    name,
    description,
    price: Number(price),
    imageUrl,
    categoryId,
    stock: Number(stock)
  };

  writeData(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = readData();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);

  if (db.products.length === initialLength) {
    return res.status(404).json({ message: "Producto no encontrado para eliminar" });
  }

  writeData(db);
  res.json({ message: "Producto eliminado exitosamente" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ocurrió un error inesperado en el servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor de MercApp corriendo en el puerto: ${PORT}`);
});
