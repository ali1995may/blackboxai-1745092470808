require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscription API',
      version: '1.0.0',
      description: 'API documentation for Subscription Management System',
    },
    servers: [
      {
        url: 'http://localhost:' + (process.env.PORT || 8000),
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');
const planRoutes = require('./routes/planRoute');
const subscriptionRoutes = require('./routes/subscriptionRoute');
const brandRoutes = require('./routes/brandRoute');
const productRoutes = require('./routes/productRoute');
const videoRoutes = require('./routes/videoRoute');
const paymentRoutes = require('./routes/paymentRoute');
const facebookAdsRoutes = require('./routes/facebookAdsRoute');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/facebook-ads', facebookAdsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
