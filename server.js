require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ],

  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization'
  ],
};

app.use(cors(corsOpts));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Plan: {
          type: 'object',
          required: ['title', 'type', 'price'],
          properties: {
            title: {
              type: 'string',
              example: 'Basic Plan',
            },
            type: {
              type: 'string',
              example: 'monthly',
            },
            price: {
              type: 'number',
              example: 9.99,
            },
            description: {
              type: 'string',
              example: 'Basic subscription plan',
            },
            features: {
              type: 'array',
              items: { type: 'string' },
              example: ['Feature 1', 'Feature 2'],
            },
            numberOfVideos: {
              type: 'integer',
              example: 10,
            },
            numberOfBrands: {
              type: 'integer',
              example: 5,
            },
            numberOfProducts: {
              type: 'integer',
              example: 20,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
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
const reportRoutes = require('./routes/reportRoute');
const heygenRoutes = require('./routes/heygenRoute');

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
app.use('/api/reports', reportRoutes);
app.use('/api/heygen', heygenRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const User = require('./models/userModel');
const PORT = process.env.PORT || 8000;

async function createDefaultAdmin() {
  try {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        email: adminEmail,
        password: 'admin123', // You should change this password after first login
        username: 'admin',
        role: 'admin',
      });
      await admin.save();
      console.log('Default admin user created with email: admin@example.com and password: admin123');
    } else {
      console.log('Default admin user already exists');
    }
  } catch (err) {
    console.error('Error creating default admin user:', err);
  }
}

mongoose.connection.once('open', () => {
  createDefaultAdmin();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
