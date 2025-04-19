const Subscription = require('../models/subscriptionModel');

const subscriptionMiddleware = {};

subscriptionMiddleware.checkActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subscription = await Subscription.findOne({
      client: userId,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    if (!subscription) {
      return res.status(403).json({ message: 'Active subscription required to perform this action' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = subscriptionMiddleware;
