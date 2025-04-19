const express = require('express');
const router = express.Router();
const facebookAdsController = require('../controllers/facebookAdsController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Facebook Ads
 *   description: Facebook Ads Library API integration
 */

/**
 * @swagger
 * /api/facebook-ads:
 *   get:
 *     summary: Get Facebook ads using Ads Library API
 *     tags: [Facebook Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search_terms
 *         schema:
 *           type: string
 *         description: Search terms for ads
 *       - in: query
 *         name: ad_type
 *         schema:
 *           type: string
 *         description: Ad type filter
 *       - in: query
 *         name: ad_reached_countries
 *         schema:
 *           type: string
 *         description: Countries reached by ads (comma separated)
 *     responses:
 *       200:
 *         description: Facebook ads data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error or missing API key
 */
router.get('/', authenticate, authorizeRoles('admin', 'client'), facebookAdsController.getAds);

module.exports = router;
