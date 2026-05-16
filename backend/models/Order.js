const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true },
  customer: { type: String },
  category: { type: String, enum: ['restaurant','bakery'], required: true },
  total: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
