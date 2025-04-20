const Brand = require('../models/brandModel');
const Subscription = require('../models/subscriptionModel');

exports.createBrand = async (req, res, next) => {
  try {
    // Check active subscription
    const subscription = await Subscription.findOne({
      client: req.user._id,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    if (!subscription) {
      return res.status(403).json({ message: 'Active subscription required to add brand' });
    }

    // Check brand count limit
    const brandCount = await Brand.countDocuments({ client: req.user._id });
    if (brandCount >= subscription.plan.numberOfBrands) {
      return res.status(403).json({ message: 'Brand limit exceeded for your subscription plan' });
    }

    const brand = new Brand({
      client: req.user._id,
      ...req.body,
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const brands = await Brand.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Brand.countDocuments(query);

    res.json({ data: brands, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (req.user.role === 'client' && !brand.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(brand);
  } catch (err) {
    next(err);
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (req.user.role === 'client' && !brand.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(brand, req.body);
    await brand.save();
    res.json(brand);
  } catch (err) {
    next(err);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (req.user.role === 'client' && !brand.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await brand.remove();
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
};
