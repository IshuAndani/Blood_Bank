const app = require('./app');
const mongoose = require('mongoose');
const {connectDB} = require('./utils/db');
require('dotenv').config();
const {startCron} = require('./cron/startCron');
const PORT = process.env.PORT || 5000;

// MongoDB connection
connectDB();

startCron();

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