const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

exports.connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Exit process if DB connection fails
    }
};