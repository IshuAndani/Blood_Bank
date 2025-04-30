const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const publicDonorRoutes = require('./routes/public/donorRoutes');
const bloodBankRoutes = require('./routes/api/v1/bloodBankRoutes');
const donorRoutes = require('./routes/api/v1/donorRoutes');
const donationRoutes = require('./routes/api/v1/donationRoutes');
const inventoryRoutes = require('./routes/api/v1/inventoryRoutes');

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
app.use('/api/auth', authRoutes);

// Public routes
app.use('/api/public/donor', publicDonorRoutes);

// Protected API routes
app.use('/api/v1/bloodbank', bloodBankRoutes);
app.use('/api/v1/donor', donorRoutes);
app.use('/api/v1/donation', donationRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

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