const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  features: { type: [String], default: [] },
  numberOfVideos: { type: Number, default: 0 },
  numberOfBrands: { type: Number, default: 0 },
  numberOfProducts: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
