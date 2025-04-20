const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create a new payment intent (client only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 *       400:
 *         description: Payment intent creation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/create-payment-intent', authenticate, authorizeRoles('client'), paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/payments/confirm-payment:
 *   post:
 *     summary: Confirm a payment intent and activate subscription (client only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *               - paymentMethodId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *               subscriptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed and subscription activated
 *       400:
 *         description: Payment confirmation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/confirm-payment', authenticate, authorizeRoles('client'), paymentController.confirmPayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment (client only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethodId
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethodId:
 *                 type: string
 *               subscriptionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Payment failed
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorizeRoles('client'), paymentController.createPayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get list of payments (client sees own, admin sees all)
 *     tags: [Payments]
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
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/', authenticate, paymentController.getPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authenticate, paymentController.getPaymentById);

module.exports = router;
