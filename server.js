const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product'); 
const Order = require('./models/Order'); 

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected! (Warehouse Open)'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// --- API ROUTES ---

// 1. GET Products (Shop)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST Product (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, category, image } = req.body;
        const newProduct = new Product({ name, price, category, image });
        await newProduct.save(); 
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST Order (Checkout)
app.post('/api/orders', async (req, res) => {
    try {
        console.log("📥 New Order Received:", req.body);
        
        const { customerName, address, phone, items, totalAmount } = req.body;
        const newOrder = new Order({ customerName, address, phone, items, totalAmount });
        await newOrder.save();
        
        res.status(201).json({ message: "Order Placed Successfully!" });
    } catch (err) {
        console.log("❌ Order Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 4. GET Orders (Dashboard)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE Order (Dashboard Cleanup)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FRONTEND ROUTES ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// --- SERVER START (Updated for Cloud) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Redder Shop is LIVE at port ${PORT}`);
});