const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription (client only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *               - paymentMethodId
 *             properties:
 *               planId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */
router.post('/', authenticate, authorizeRoles('client'), subscriptionController.createSubscription);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get subscriptions (client sees own, admin sees all)
 *     tags: [Subscriptions]
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
 *         description: Search term (admin only)
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, subscriptionController.getSubscriptions);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get subscription by ID
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Subscription not found
 */
router.get('/:id', authenticate, subscriptionController.getSubscriptionById);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Cancel subscription (client or admin)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription cancelled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Subscription not found
 */
router.delete('/:id', authenticate, subscriptionController.cancelSubscription);

module.exports = router;
