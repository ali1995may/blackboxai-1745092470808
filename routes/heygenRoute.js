const express = require('express');
const router = express.Router();
const heygenController = require('../controllers/heygenController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: HeyGen
 *   description: HeyGen video creation and OpenAI transcription
 */

/**
 * @swagger
 * /api/heygen/extract-text:
 *   post:
 *     summary: Extract text from video URL using OpenAI transcription
 *     tags: [HeyGen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: Video URL
 *     responses:
 *       200:
 *         description: Transcribed text
 *       400:
 *         description: Bad request
 */
router.post('/extract-text', authenticate, authorizeRoles('client'), heygenController.extractTextFromVideo);

/**
 * @swagger
 * /api/heygen/avatars/{gender}:
 *   get:
 *     summary: Get avatars filtered by gender
 *     tags: [HeyGen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gender
 *         required: true
 *         schema:
 *           type: string
 *         description: Gender filter (e.g., male, female)
 *     responses:
 *       200:
 *         description: List of avatars
 */
router.get('/avatars/:gender', authenticate, authorizeRoles('client'), heygenController.getAvatarsByGender);

/**
 * @swagger
 * /api/heygen/create-video:
 *   post:
 *     summary: Create video with HeyGen API
 *     tags: [HeyGen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatarId
 *               - inputText
 *               - productType
 *             properties:
 *               avatarId:
 *                 type: string
 *               inputText:
 *                 type: string
 *               productType:
 *                 type: string
 *               soundTone:
 *                 type: string
 *               positionAvatar:
 *                 type: object
 *                 properties:
 *                   x:
 *                     type: number
 *                   y:
 *                     type: number
 *               positionBackground:
 *                 type: string
 *               backgroundType:
 *                 type: string
 *               backgroundUrl:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video creation response
 */
router.post('/create-video', authenticate, authorizeRoles('client'), heygenController.createHeygenVideo);

/**
 * @swagger
 * /api/heygen/video-status/{videoId}:
 *   get:
 *     summary: Get video creation status from HeyGen
 *     tags: [HeyGen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video status
 */
router.get('/video-status/:videoId', authenticate, authorizeRoles('client'), heygenController.getVideoStatus);

/**
 * @swagger
 * /api/heygen/my-videos:
 *   get:
 *     summary: Get all videos created by the authenticated client
 *     tags: [HeyGen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of videos
 */
router.get('/my-videos', authenticate, authorizeRoles('client'), heygenController.getUserVideos);

module.exports = router;
