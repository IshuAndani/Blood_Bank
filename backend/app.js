const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api/apiRoutes');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

// ✅ Allowed Origins — Add any other frontend URLs here
const allowedOrigins = [
  'http://localhost:3000',
  'https://majestic-cascaron-2edb22.netlify.app'
];

// ✅ CORS Options
const corsOptions = {
