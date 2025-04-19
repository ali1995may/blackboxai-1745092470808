const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Plan management
 */

/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Create a new plan (admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorizeRoles('admin'), planController.createPlan);

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get list of plans with pagination and search
 *     tags: [Plans]
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
 *         description: Search term for plan title
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get('/', planController.getPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan data
 *       404:
 *         description: Plan not found
 */
router.get('/:id', planController.getPlanById);

/**
 * @swagger
 * /api/plans/{id}:
 *   put:
 *     summary: Update a plan (admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan updated
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticate, authorizeRoles('admin'), planController.updatePlan);

/**
 * @swagger
 * /api/plans/{id}:
 *   delete:
 *     summary: Delete a plan (admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), planController.deletePlan);

module.exports = router;
