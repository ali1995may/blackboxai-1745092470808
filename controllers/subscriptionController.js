const Subscription = require('../models/subscriptionModel');
const Plan = require('../models/planModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res, next) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const clientId = req.user._id;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // If plan price is zero, create active subscription without Stripe
    if (plan.price === 0) {
      const startDate = new Date();
      // Set endDate to 1 year from now or any desired duration for free plan
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const newSubscription = new Subscription({
        client: clientId,
        plan: planId,
        startDate,
        endDate,
        status: 'active',
        stripeSubscriptionId: 'free-plan',
      });
      await newSubscription.save();

      return res.status(201).json({ subscription: newSubscription, message: 'Free plan activated' });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
      });
      stripeCustomerId = customer.id;
      // Save stripeCustomerId to user model (optional)
      req.user.stripeCustomerId = stripeCustomerId;
      await req.user.save();
    }

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: plan.stripePriceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription in DB
    const newSubscription = new Subscription({
      client: clientId,
      plan: planId,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
    });
    await newSubscription.save();

    res.status(201).json({ subscription: newSubscription, stripeSubscription });
  } catch (err) {
    next(err);
  }
};

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'admin' && search) {
      // Admin can search by client email or plan title (optional)
      // For simplicity, no search implemented here
    }

    const subscriptions = await Subscription.find(query)
      .populate('client', 'email username')
      .populate('plan')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Subscription.countDocuments(query);

    res.json({ data: subscriptions, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('client', 'email username')
      .populate('plan');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (req.user.role === 'client' && !subscription.client._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (req.user.role === 'client' && !subscription.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cancel subscription in Stripe if not free plan
    if (subscription.stripeSubscriptionId !== 'free-plan') {
      await stripe.subscriptions.del(subscription.stripeSubscriptionId);
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    next(err);
  }
};