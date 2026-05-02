import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("data.db");

// --- Database Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    contact TEXT,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS variants (
    id TEXT PRIMARY KEY,
    productId TEXT,
    type TEXT,
    price REAL,
    FOREIGN KEY(productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerId TEXT,
    productVariantId TEXT,
    quantity INTEGER,
    totalPrice REAL,
    paidAmount REAL,
    status TEXT,
    createdAt TEXT,
    deliveryDate TEXT,
    FOREIGN KEY(customerId) REFERENCES customers(id),
    FOREIGN KEY(productVariantId) REFERENCES variants(id)
  );
`);

// --- Seeding logic ---
const customerCount = db.prepare("SELECT count(*) as count FROM customers").get() as any;
if (customerCount.count === 0) {
  const insertCustomer = db.prepare("INSERT INTO customers (id, name, email, contact, address) VALUES (?, ?, ?, ?, ?)");
  const seedCustomers = [
    ["1", "Elena Satori", "elena@satori.io", "123-456", "Tokyo, JP"],
    ["2", "Julian Hayes", "julian@hayes.com", "234-567", "London, UK"],
    ["3", "Maya Brin", "maya@brin.design", "345-678", "Berlin, DE"],
    ["4", "Roman Chen", "roman@chen.dev", "456-789", "Shanghai, CN"],
    ["5", "Oliver West", "oliver@west.me", "567-890", "NYC, US"],
    ["6", "Aria Luxe", "aria@luxe.fm", "678-901", "Paris, FR"]
  ];
  seedCustomers.forEach(c => insertCustomer.run(...c));

  const insertProduct = db.prepare("INSERT INTO products (id, name) VALUES (?, ?)");
  const seedProducts = [
    ["p1", "Echo - Mouth"],
    ["p2", "Echo - Eear"]
  ];
  seedProducts.forEach(p => insertProduct.run(...p));

  const insertVariant = db.prepare("INSERT INTO variants (id, productId, type, price) VALUES (?, ?, ?, ?)");
  const seedVariants = [
    ["v1", "p1", "Bluetooth", 12000],
    ["v2", "p1", "Bluetooth", 15000],
    ["v3", "p1", "Non-Bluetooth", 12000],
    ["v4", "p1", "Non-Bluetooth", 15000],
    ["v5", "p2", "Bluetooth", 12000],
    ["v6", "p2", "Bluetooth", 15000],
    ["v7", "p2", "Non-Bluetooth", 12000],
    ["v8", "p2", "Non-Bluetooth", 15000]
  ];
  seedVariants.forEach(v => insertVariant.run(...v));

  const insertOrder = db.prepare("INSERT INTO orders (id, customerId, productVariantId, quantity, totalPrice, paidAmount, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const seedOrders = [
    ["o1", "1", "v1", 1, 12000, 12000, "paid", new Date(Date.now() - 86400000 * 2).toISOString()],
    ["o2", "2", "v3", 1, 12000, 5000, "partial", new Date(Date.now() - 86400000 * 5).toISOString()],
    ["o3", "3", "v4", 2, 30000, 30000, "paid", new Date(Date.now() - 86400000 * 10).toISOString()]
  ];
  seedOrders.forEach(o => insertOrder.run(...o));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---
  app.get("/api/customers", (req, res) => {
    const customers = db.prepare("SELECT * FROM customers").all();
    res.json(customers);
  });
  
  app.post("/api/customers", (req, res) => {
    const { name, email, contact, address } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO customers (id, name, email, contact, address) VALUES (?, ?, ?, ?, ?)")
      .run(id, name, email, contact, address);
    res.status(201).json({ id, name, email, contact, address });
  });

  app.patch("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, contact, address } = req.body;
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as any;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    
    db.prepare(`
      UPDATE customers 
      SET name = ?, email = ?, contact = ?, address = ? 
      WHERE id = ?
    `).run(
      name ?? customer.name,
      email ?? customer.email,
      contact ?? customer.contact,
      address ?? customer.address,
      id
    );
    
    const updated = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    res.json(updated);
  });

  app.delete("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM customers WHERE id = ?").run(id);
    res.status(204).send();
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/variants", (req, res) => {
    const variants = db.prepare("SELECT * FROM variants").all();
    res.json(variants);
  });

  app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders").all();
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const { customerId, productVariantId, quantity, paidAmount, deliveryDate } = req.body;
    const variant = db.prepare("SELECT * FROM variants WHERE id = ?").get(productVariantId) as any;
    if (!variant) return res.status(404).json({ error: "Variant not found" });

    const totalPrice = quantity * variant.price;
    const status = paidAmount >= totalPrice ? "paid" : (paidAmount > 0 ? "partial" : "pending");
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (id, customerId, productVariantId, quantity, totalPrice, paidAmount, status, createdAt, deliveryDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, customerId, productVariantId, quantity, totalPrice, paidAmount, status, createdAt, deliveryDate);

    res.status(201).json({ id, customerId, productVariantId, quantity, totalPrice, paidAmount, status, createdAt, deliveryDate });
  });

  app.patch("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { customerId, productVariantId, quantity, totalPrice, paidAmount, status, deliveryDate } = req.body;
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
    if (!order) return res.status(404).json({ error: "Order not found" });

    const newPaidAmount = paidAmount !== undefined ? paidAmount : order.paidAmount;
    const newTotalPrice = totalPrice !== undefined ? totalPrice : order.totalPrice;
    
    let newStatus = status;
    if (!newStatus) {
      newStatus = newPaidAmount >= newTotalPrice ? "paid" : (newPaidAmount > 0 ? "partial" : "pending");
    }

    db.prepare(`
      UPDATE orders 
      SET customerId = ?, productVariantId = ?, quantity = ?, totalPrice = ?, paidAmount = ?, status = ?, deliveryDate = ?
      WHERE id = ?
    `).run(
      customerId ?? order.customerId,
      productVariantId ?? order.productVariantId,
      quantity ?? order.quantity,
      newTotalPrice,
      newPaidAmount,
      newStatus,
      deliveryDate ?? order.deliveryDate,
      id
    );

    const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    res.json(updated);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
