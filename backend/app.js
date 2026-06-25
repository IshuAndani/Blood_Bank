const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api/apiRoutes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

// ✅ Allowed Origins — Add any other frontend URLs here
const allowedOrigins = [
  'http://localhost:3000',
  'https://blood-bank-management-uitrgpv.netlify.app'
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();

// 🛡 Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔁 API Routes
app.use('/api', apiRoutes);

// 🌍 Root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 🧯 Error Middleware
app.use(errorMiddleware);

module.exports = app;