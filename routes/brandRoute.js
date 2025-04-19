const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand (client only with active subscription)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Active subscription required
 */
router.post('/', authenticate, authorizeRoles('client'), brandController.createBrand);

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get list of brands (client sees own, admin sees all)
 *     tags: [Brands]
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
 *         description: Search term for brand title
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', authenticate, brandController.getBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Brand not found
 */
router.get('/:id', authenticate, brandController.getBrandById);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update a brand (client or admin)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Brand not found
 */
router.put('/:id', authenticate, brandController.updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand (client or admin)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Brand not found
 */
router.delete('/:id', authenticate, brandController.deleteBrand);

module.exports = router;
