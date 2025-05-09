const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const publicDonorRoutes = require('./routes/public/donorRoutes');
const bloodBankRoutes = require('./routes/api/v1/bloodBankRoutes');
const hospitalRoutes = require('./routes/api/v1/hospitalRoutes');
const bloodRequestRoutes = require('./routes/api/v1/bloodRequestRoutes');
const donorRoutes = require('./routes/api/v1/donorRoutes');
const donationRoutes = require('./routes/api/v1/donationRoutes');
const inventoryRoutes = require('./routes/api/v1/inventoryRoutes');

const { errorMiddleware } = require('./middlewares/errorMiddleware');

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Public routes
app.use('/api/public/donor', publicDonorRoutes);

// Protected API routes
app.use('/api/v1/bloodbank', bloodBankRoutes);
app.use('/api/v1/hospital', hospitalRoutes);
app.use('/api/v1/bloodrequest', bloodRequestRoutes);
app.use('/api/v1/donor', donorRoutes);
app.use('/api/v1/donation', donationRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;

// const asyncHandler = fn => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
  
//   export default asyncHandler;
//   ✅ utils/response.util.js
//   js
//   Copy
//   Edit
//   export const sendResponse = (res, statusCode, success, message, data = {}) => {
//     res.status(statusCode).json({
//       success,
//       message,
//       data,
//     });
//   };
//   ✅ utils/error.handler.js
//   js
//   Copy
//   Edit
//   export class AppError extends Error {
//     constructor(message, statusCode) {
//       super(message);
//       this.statusCode = statusCode || 500;
//       this.isOperational = true; // can be used to separate known errors from programming bugs
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
//   ✅ middlewares/error.middleware.js
//   js
//   Copy
//   Edit
//   import { AppError } from '../utils/error.handler.js';
  
//   export const errorMiddleware = (err, req, res, next) => {
//     console.error('Error:', err); // optionally use a logging lib
  
//     let statusCode = err.statusCode || 500;
//     let message = err.message || 'Internal Server Error';
  
//     // Handle unexpected errors differently if needed
//     if (!err.isOperational) {
//       statusCode = 500;
//       message = 'Something went wrong!';
//     }
  
//     res.status(statusCode).json({
//       success: false,
//       message,
//       data: null,
//     });
//   };