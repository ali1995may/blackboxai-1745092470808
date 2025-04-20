const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports and statistics
 */

/**
 * @swagger
 * /api/reports/stats:
 *   get:
 *     summary: Get overall stats (brands, products, videos)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID filter
 *     responses:
 *       200:
 *         description: Overall stats
 */
router.get('/stats', authenticate, authorizeRoles('admin', 'client'), reportController.getStats);

/**
 * @swagger
 * /api/reports/brands:
 *   get:
 *     summary: Get brand stats grouped by type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID filter
 *     responses:
 *       200:
 *         description: Brand stats
 */
router.get('/brands', authenticate, authorizeRoles('admin', 'client'), reportController.getBrandStats);

/**
 * @swagger
 * /api/reports/products:
 *   get:
 *     summary: Get product stats grouped by title
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID filter
 *     responses:
 *       200:
 *         description: Product stats
 */
router.get('/products', authenticate, authorizeRoles('admin', 'client'), reportController.getProductStats);

/**
 * @swagger
 * /api/reports/videos:
 *   get:
 *     summary: Get video stats grouped by status
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID filter
 *     responses:
 *       200:
 *         description: Video stats
 */
router.get('/videos', authenticate, authorizeRoles('admin', 'client'), reportController.getVideoStats);

module.exports = router;
