const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  localVideoUrl: { type: String },
  text: { type: String },
  description: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  avatarId: { type: String },
  avatarType: { type: String },
  soundTone: { type: String },
  emotion: { type: String },
  position: {
    avatar: { type: String },
    background: { type: String },
  },
  productType: { type: String },
  openAIExtractedText: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
