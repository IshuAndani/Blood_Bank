const express = require('express');
const { login } = require('../controllers/auth/loginController');
const { registerEmployee } = require('../controllers/auth/registrationController');
const { protect } = require('../middlewares/auth/protect');
const { checkRole } = require('../middlewares/auth/roleMiddleware');

const router = express.Router();

// Login route
router.post('/login', login);

// Register employee route
router.post('/register', protect, checkRole(['superadmin', 'headadmin']), registerEmployee);

module.exports = router;