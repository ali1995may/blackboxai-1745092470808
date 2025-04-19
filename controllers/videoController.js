const Video = require('../models/videoModel');
const Subscription = require('../models/subscriptionModel');

exports.createVideo = async (req, res, next) => {
  try {
    // Check active subscription
    const subscription = await Subscription.findOne({
      client: req.user._id,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    if (!subscription) {
      return res.status(403).json({ message: 'Active subscription required to add video' });
    }

    const video = new Video({
      client: req.user._id,
      ...req.body,
      status: 'pending',
    });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { client: req.user._id };

    if (search) {
      query.text = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Video.countDocuments(query);

    res.json({ data: videos, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (req.user.role === 'client' && !video.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(video);
  } catch (err) {
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (req.user.role === 'client' && !video.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(video, req.body);
    await video.save();
    res.json(video);
  } catch (err) {
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (req.user.role === 'client' && !video.client.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await video.remove();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    next(err);
  }
};
