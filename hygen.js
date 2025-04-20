const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'OWQ0Mjc4NTVlZmUwNDg5Mjk0OTg5MzBmYjNlNThhMmYtMTc0Mjg1MjY1Ng=='; // Replace with your HeyGen API key

app.use(cors());
app.use(bodyParser.json());

// 1. API to get all avatars by gender
app.get('/api/avatars/:gender', async (req, res) => {
    const { gender } = req.params;
    try {
        const response = await axios.get(`https://api.heygen.com/v2/avatars?gender=${gender}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': API_KEY
            }
        });
		var avatars=response.data.data.avatars;
		// Filter avatars based on gender
        const filteredAvatars = avatars.filter(avatar => avatar.gender === gender);
        res.json(filteredAvatars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 5. API to get all available voices
app.get('/api/voices', async (req, res) => {
    try {
        const response = await axios.get('https://api.heygen.com/v2/voices', {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 2. API to generate video by text, avatar_id, and other attributes
app.get('/api/generate-video', async (req, res) => {
    const { avatarId, inputText, productName, productType, duration,voiceId } = req.body;

    const payload = {
        video_inputs: [
            {
                character: {
                    type: 'avatar',
                    avatar_id: avatarId,
                    avatar_style: 'normal',
					offset: { "x": 0, "y": 0 },
					scale:1
                },
                voice: {
                    type: 'text',
                    input_text: 'Welcome to the HeyGen API! my name is jhon so i need any thing',
                    voice_id: '2d5b0e6cf36f460aa7fc47e3eee4ba54', // Replace with a valid voice ID,
					speed: 1,//Voice speed, value between 0.5 and 1.5. Default is 1.
					pitch:0,//Voice pitch, value between -50 and 50. Default is 0.
					emotion:"Friendly",//Voice emotion, if voice support emotion. value are ['Excited','Friendly','Serious','Soothing','Broadcaster']

                },
				background: {
					  "type": "image", // image or video or color
					  "url": "https://cdn.pixabay.com/video/2024/03/01/202587-918431513_tiny.jpg"
					}
            }
        ],
        dimension: {
            width: 1280,
            height: 720
        },
       attributes: {
        duration: '10', // Duration in seconds
        product_name: 'Nike', // Product name
        product_type: 'clothes', // Product type
        product_image: 'https://www.vanhelden.nl/media/catalog/product/i/m/impr_922825-PDP_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700', // Replace with the actual image URL
        brand: 'Nike' // Brand name
    }
    };

    
        const response = await axios.post('https://api.heygen.com/v2/video/generate', payload, {
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
		
        res.json(response.data);
  
});

// 3. API to generate video by similar video and percentage
app.post('/api/generate-similar-video', async (req, res) => {
    const { videoId, percentage } = req.body;
    const payload = {
        video_id: videoId,
        percentage: percentage
    };

    try {
        const response = await axios.post('https://api.heygen.com/v2/video/generate/similar', payload, {
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. API to get video status by video ID
app.get('/api/video-status/:videoId', async (req, res) => {
    const { videoId } = req.params;
    try {
        const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});