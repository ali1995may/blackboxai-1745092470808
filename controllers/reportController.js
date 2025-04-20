const Brand = require('../models/brandModel');
const Product = require('../models/productModel');
const Video = require('../models/videoModel');
const mongoose = require('mongoose');

exports.getStats = async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const match = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if (userId) {
      match.client = mongoose.Types.ObjectId(userId);
    }

    // Brands count
    const brandCount = await Brand.countDocuments(match);

    // Products count
    const productCount = await Product.countDocuments(match);

    // Videos count
    const videoCount = await Video.countDocuments(match);

    res.json({
      brandCount,
      productCount,
      videoCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBrandStats = async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const match = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if (userId) {
      match.client = mongoose.Types.ObjectId(userId);
    }

    const brands = await Brand.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(brands);
  } catch (err) {
    next(err);
  }
};

exports.getProductStats = async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const match = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if (userId) {
      // Get brands of user
      const brands = await Brand.find({ client: mongoose.Types.ObjectId(userId) }).select('_id');
      const brandIds = brands.map(b => b._id);
      match.brand = { $in: brandIds };
    }

    const products = await Product.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$title',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getVideoStats = async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const match = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if (userId) {
      match.client = mongoose.Types.ObjectId(userId);
    }

    const videos = await Video.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(videos);
  } catch (err) {
    next(err);
  }
};
