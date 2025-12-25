require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000; // Render uses 10000 by default

// Middleware
app.use(cors());
app.use(express.json());

// =============================================================
// 📸 THE FIX: SERVE THE IMAGE FOLDER
// =============================================================
// This tells the server: "If the link starts with /sub, look in the sub folder"
app.use('/sub', express.static(path.join(__dirname, 'sub')));

// serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// serve dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// Schemas
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    phone: String,
    items: Array,
    totalAmount: Number,
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// API Routes
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(200).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: "Failed to save order" });
    }
});

app.get('/api/orders', async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
});

app.delete('/api/orders/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Serve the Main Shop (Index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));