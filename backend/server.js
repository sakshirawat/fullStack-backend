// Load environment variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');  // For handling file uploads (currently unused here)
const path = require('path');      // For handling file and directory paths
const cors = require('cors');      // Middleware to enable Cross-Origin Resource Sharing

// Import Swagger UI and specification for API documentation
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express(); // Initialize Express app

// CORS configuration options to allow frontend (localhost:3000) to access backend APIs
const corsOptions = {
  origin: 'https://appointmenthealthcare.netlify.app',           // Allow only this origin (React frontend running locally)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],   // Allowed headers in requests
  credentials: true,                         // Allow sending cookies and authentication info
};

// Apply CORS middleware with above options to all routes
app.use(cors(corsOptions));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Middleware to parse incoming requests with URL-encoded payloads (form submissions)
app.use(express.urlencoded({ extended: true }));

// Setup Swagger UI to serve API docs at /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routers for authentication and appointment-related routes
const authRouter = require('./routes/auth');
const appointRouter = require('./routes/appointment');

// Mount routers on specific paths
app.use('/auth', authRouter);         // Routes for user authentication e.g. /auth/signup, /auth/signin
app.use('/appoint', appointRouter);   // Routes for appointments e.g. /appoint/book, /appoint/list

// Simple test route to verify server is running
app.get('/ping', (req, res) => {
  res.send('pong'); // Respond with 'pong' to any GET request on /ping
});

// Serve static files from 'uploads' folder, making uploaded files accessible via /uploads URL
app.use('/uploads', express.static('uploads'));

// Error handling middleware - catches errors thrown in routes/middlewares
app.use((error, req, res, next) => {
  console.log(error);               // Log the error to the console for debugging
  const status = error.statusCode || 500;   // Default to 500 if statusCode not set
  const message = error.message;             // Error message to send in response
  const data = error.data;                    // Additional error data (e.g., validation errors)
  console.log(status, message);               // Log status and message
  res.status(status).json({ message, data }); // Send JSON response with error info
});

// ====== Database Connection & Server Start ====== //

// Read MongoDB connection URI from environment variables (stored in .env)
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Connect to MongoDB database using Mongoose
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected"); // Log success message when DB connection established

    // Start Express server listening on port 1000 after DB connection succeeds
    app.listen(PORT, () => {
      console.log('MONGO_URI:', process.env.MONGODB_URI); // Log connection string (for debugging)
      console.log(`Server is running on http://localhost:1000`); // Inform server is ready
    });
  })
  .catch((err) => {
    // Catch and log any error that occurs while connecting to MongoDB
    console.error("MongoDB connection failed:", err.message);
  });
