const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  category: { type: String, enum: ['restaurant','bakery'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);
