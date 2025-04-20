const axios = require('axios');
const Video = require('../models/videoModel');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const ytdl = require('ytdl-core');

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || 'YOUR_HEYGEN_API_KEY';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';

const openaiConfig = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

// Helper functions
async function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { filter: 'audioandvideo' });
    const fileStream = fs.createWriteStream(outputPath);
    stream.pipe(fileStream);
    fileStream.on('finish', () => resolve(outputPath));
    fileStream.on('error', reject);
  });
}

async function extractAudio(videoPath) {
  const audioPath = videoPath.replace(/\.[^/.]+$/, '.mp3');
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${videoPath}" -q:a 0 -map a "${audioPath}"`, (error) => {
      if (error) reject(error);
      else resolve(audioPath);
    });
  });
}

async function transcribeAudio(audioPath) {
  const fileStream = fs.createReadStream(audioPath);
  const response = await openai.createTranscription(fileStream, 'whisper-1');
  return response.data.text;
}

// API: Extract text from video URL
exports.extractTextFromVideo = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'Video URL is required' });

    const tempVideoPath = path.join(__dirname, '../temp', `video_${Date.now()}.mp4`);
    if (!fs.existsSync(path.dirname(tempVideoPath))) {
      fs.mkdirSync(path.dirname(tempVideoPath), { recursive: true });
    }

    await downloadVideo(url, tempVideoPath);
    const audioPath = await extractAudio(tempVideoPath);
    const transcribedText = await transcribeAudio(audioPath);

    fs.unlinkSync(tempVideoPath);
    fs.unlinkSync(audioPath);

    res.json({ transcribedText });
  } catch (err) {
    next(err);
  }
};

// API: Get avatars by gender from HeyGen
exports.getAvatarsByGender = async (req, res, next) => {
  try {
    const { gender } = req.params;
    const response = await axios.get(`https://api.heygen.com/v2/avatars?gender=${gender}`, {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    });
    const avatars = response.data.data.avatars.filter(a => a.gender === gender);
    res.json(avatars);
  } catch (err) {
    next(err);
  }
};

// API: Get all emotions from HeyGen
exports.getEmotions = async (req, res, next) => {
  try {
    const response = await axios.get('https://api.heygen.com/v2/emotions', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// API: Get all avatar types from HeyGen
exports.getAvatarTypes = async (req, res, next) => {
  try {
    const response = await axios.get('https://api.heygen.com/v2/avatar-types', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// API: Create video with HeyGen (including avatarStyle, emotion, locale)
exports.createHeygenVideo = async (req, res, next) => {
  try {
    const {
      avatarId,
      avatarType,
      avatarStyle,
      inputText,
      productType,
      soundTone,
      emotion,
      locale,
      positionAvatar,
      positionBackground,
      backgroundType,
      backgroundUrl,
      videoUrl,
    } = req.body;

    const payload = {
      video_inputs: [
        {
          character: {
            type: avatarType || 'avatar',
            avatar_id: avatarId,
            avatar_style: avatarStyle || 'normal',
            offset: positionAvatar || { x: 0, y: 0 },
            scale: 1,
          },
          voice: {
            type: 'text',
            input_text: inputText,
            voice_id: soundTone,
            speed: 1,
            pitch: 0,
            emotion: emotion || 'Friendly',
            locale: locale || 'en-US',
          },
          background: {
            type: backgroundType || 'image',
            url: backgroundUrl || '',
          },
        },
      ],
      dimension: {
        width: 1280,
        height: 720,
      },
      attributes: {
        duration: '10',
        product_type: productType,
        product_image: videoUrl,
      },
    };

    const response = await axios.post('https://api.heygen.com/v2/video/generate', payload, {
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const video = new Video({
      client: req.user._id,
      url: videoUrl,
      text: inputText,
      productType,
      avatarId,
      avatarType,
      avatarStyle,
      soundTone,
      emotion,
      locale,
      position: {
        avatar: positionAvatar,
        background: positionBackground,
      },
      status: 'pending',
      openAIExtractedText: inputText,
      localVideoUrl: response.data.video_url || '',
    });
    await video.save();

    res.json({ video, heygenResponse: response.data });
  } catch (err) {
    next(err);
  }
};

// API: Get video creation status from HeyGen
exports.getVideoStatus = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// API: Get all videos created by user
exports.getUserVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ client: req.user._id });
    res.json(videos);
  } catch (err) {
    next(err);
  }
};