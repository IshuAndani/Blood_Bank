const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api/apiRoutes');

const { errorMiddleware } = require('./middlewares/errorMiddleware');

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api',apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;