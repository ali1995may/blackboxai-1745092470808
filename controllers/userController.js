const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, username, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = new User({ email, password, username, phone, address, role: 'client' });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({ id: user._id, email: user.email, username: user.username, phone: user.phone, address: user.address, role: user.role });
  } catch (err) {
    next(err);
  }
};
