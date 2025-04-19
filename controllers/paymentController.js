const Payment = require('../models/paymentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethodId, subscriptionId } = req.body;
    const clientId = req.user._id;

    // Create or retrieve Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
      });
      stripeCustomerId = customer.id;
      req.user.stripeCustomerId = stripeCustomerId;
      await req.user.save();
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    // Save payment record
    const payment = new Payment({
      client: clientId,
      amount,
      status: 'completed',
      stripePaymentId: paymentIntent.id,
      creditCardLast4: paymentIntent.charges.data[0].payment_method_details.card.last4,
      creditCardBrand: paymentIntent.charges.data[0].payment_method_details.card.brand,
    });
    await payment.save();

    res.status(201).json(payment);
  } catch (err) {
    if (err.raw && err.raw.message) {
      return res.status(400).json({ message: err.raw.message });
    }
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    const payments = await Payment.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({ data: payments, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    if (req.user.role === 'client' && !payment.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(payment);
  } catch (err) {
    next(err);
  }
};
