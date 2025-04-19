const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management
 */

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Create a new video (client only with active subscription)
 *     tags: [Videos]
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
 *               text:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Active subscription required
 */
router.post('/', authenticate, authorizeRoles('client'), videoController.createVideo);

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get list of videos (client sees own, admin sees all)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for video text
 *     responses:
 *       200:
 *         description: List of videos
 */
router.get('/', authenticate, videoController.getVideos);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Video not found
 */
router.get('/:id', authenticate, videoController.getVideoById);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update a video (client or admin)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               text:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, failed]
 *     responses:
 *       200:
 *         description: Video updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Video not found
 */
router.put('/:id', authenticate, videoController.updateVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Delete a video (client or admin)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Video not found
 */
router.delete('/:id', authenticate, videoController.deleteVideo);

module.exports = router;
