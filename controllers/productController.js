const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const Subscription = require('../models/subscriptionModel');

exports.createProduct = async (req, res, next) => {
  try {
    // Check active subscription
    const subscription = await Subscription.findOne({
      client: req.user._id,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    if (!subscription) {
      return res.status(403).json({ message: 'Active subscription required to add product' });
    }

    // Check product count limit
    const productCount = await Product.countDocuments({ brand: req.body.brand });
    if (productCount >= subscription.plan.numberOfProducts) {
      return res.status(403).json({ message: 'Product limit exceeded for your subscription plan' });
    }

    // Check brand ownership
    const brand = await Brand.findById(req.body.brand);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (req.user.role === 'client' && !brand.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied to this brand' });
    }

    const product = new Product({
      ...req.body,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};

    if (req.user.role === 'client') {
      // Get brands owned by client
      const brands = await Brand.find({ client: req.user._id }).select('_id');
      const brandIds = brands.map(b => b._id);
      query.brand = { $in: brandIds };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({ data: products, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.user.role === 'client') {
      const brand = await Brand.findById(product.brand);
      if (!brand.client.equals(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.user.role === 'client') {
      const brand = await Brand.findById(product.brand);
      if (!brand.client.equals(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.user.role === 'client') {
      const brand = await Brand.findById(product.brand);
      if (!brand.client.equals(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
