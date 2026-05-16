const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['restaurant', 'bakery', 'admin'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
