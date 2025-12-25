const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Sample Data (The clothes we are putting on the shelf)
const products = [
    {
        name: "Emerald Green Velvet Suit",
        price: 2499,
        category: "Suit",
        image: "https://m.media-amazon.com/images/I/61H4k0qWbGL._SY741_.jpg",
        inStock: true
    },
    {
        name: "Ruby Red Co-ord Set",
        price: 1850,
        category: "Co-ord",
        image: "https://m.media-amazon.com/images/I/71eUwDk8YzL._SY741_.jpg",
        inStock: true
    },
    {
        name: "Royal Blue Pashmina",
        price: 3200,
        category: "Suit",
        image: "https://m.media-amazon.com/images/I/51uGecKf7lL._SX569_.jpg",
        inStock: true
    }
];

// The Logic to connect and save
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to Warehouse');
        
        // 1. Clear any old junk
        await Product.deleteMany({});
        console.log('🧹 Old stock cleared');

        // 2. Add new items
        await Product.insertMany(products);
        console.log('📦 New stock added successfully!');

        // 3. Close connection
        mongoose.connection.close();
    })
    .catch(err => {
        console.log('❌ Error:', err);
    });
    