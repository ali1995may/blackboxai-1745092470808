const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  stripePaymentId: { type: String, required: true },
  creditCardLast4: { type: String },
  creditCardBrand: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
