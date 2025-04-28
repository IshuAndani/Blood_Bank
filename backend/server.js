const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { connectDB } = require('./utils/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(process.env.API_AUTH_PATH, authRoutes);
app.use(process.env.API_BLOODBANK_PATH, bloodBankRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// MongoDB connection
connectDB();

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    process.exit(0);
});
