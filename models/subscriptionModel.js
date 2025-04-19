const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  stripeSubscriptionId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
