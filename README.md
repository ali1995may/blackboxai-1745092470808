
Built by https://www.blackbox.ai

---

```markdown
# Subscription API

## Project Overview
The Subscription API is a Node.js application designed for managing subscriptions with integrations for Stripe and Facebook Ads. This API facilitates user registration, subscription plans, and payment processing, and provides an interface for managing ads through Facebook. Additionally, it includes API documentation generated using Swagger.

## Installation

To install this project, you will need Node.js and npm (Node Package Manager) installed on your machine. Follow these steps to get started:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/subscription-api.git
   ```

2. **Change into the project directory**:
   ```bash
   cd subscription-api
   ```

3. **Install the dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root of the project and add the following variables:
   ```plaintext
   MONGODB_URI=<Your MongoDB connection string>
   PORT=<Your desired port (optional, defaults to 8000)>
   ```

## Usage

To start the application, use the following command:

```bash
npm start
```

For development (with auto-reload), you may use:

```bash
npm run dev
```

Once the server is running, you can access the API documentation at:

```
http://localhost:<PORT>/api-docs
```

Replace `<PORT>` with the port you specified or default to `8000`.

## Features

- User registration and authentication with bcryptjs and JWT.
- Subscription management including creation, updates, and retrieval.
- Stripe integration for payment processing.
- Integration with Facebook Ads for managing advertisements.
- RESTful API structure with clear routing.
- Swagger UI for API documentation and testing endpoints.

## Dependencies

This project has the following dependencies listed in `package.json`:

- **axios**: ^1.4.0 — Promise-based HTTP Client for node.js and the browser.
- **bcryptjs**: ^2.4.3 — A library to help hash passwords.
- **dotenv**: ^16.3.1 — Module to load environment variables from a .env file.
- **express**: ^4.18.2 — Fast, unopinionated, minimalist web framework for Node.js.
- **jsonwebtoken**: ^9.0.0 — JSON Web Token implementation for authentication.
- **mongoose**: ^7.3.1 — MongoDB object modeling for Node.js.
- **stripe**: ^12.15.0 — Stripe API client for managing payments.
- **swagger-jsdoc**: ^6.2.8 — Swagger documentation generator for Express APIs.
- **swagger-ui-express**: ^4.6.3 — Middleware for serving Swagger UI.

Development dependency:

- **nodemon**: ^3.0.1 — A utility that will monitor for any changes in your source and automatically restart your server.

## Project Structure

The project structure is as follows:

```
subscription-api/
│
├── routes/
│   ├── adminRoute.js         # Admin endpoints
│   ├── brandRoute.js         # Brand management endpoints
│   ├── facebookAdsRoute.js   # Facebook Ads management endpoints
│   ├── paymentRoute.js       # Payment processing endpoints
│   ├── planRoute.js          # Subscription plans management endpoints
│   ├── productRoute.js       # Product management endpoints
│   ├── subscriptionRoute.js   # Subscription management endpoints
│   └── userRoute.js          # User management endpoints
│
├── .env                       # Environment variables
├── package.json               # Project metadata and dependencies
└── server.js                  # Entry point for the application
```

Feel free to explore the API endpoints through the documentation and contribute to the project if you wish!
```