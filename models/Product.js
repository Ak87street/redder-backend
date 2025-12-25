const mongoose = require('mongoose');

// The Blueprint (Schema)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },  // e.g., "Velvet Suit"
    price: { type: Number, required: true }, // e.g., 2500
    category: { type: String, required: true }, // e.g., "Suit" or "Co-ord"
    image: { type: String, required: true }, // We will store the link to the image
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);