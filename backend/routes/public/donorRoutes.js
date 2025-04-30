const express = require('express');
const { registerDonor, loginDonor } = require('../../controllers/donor/donorController');

const router = express.Router();

// Public route for donor self-registration
router.post('/register', registerDonor);

router.post('/login', loginDonor);

module.exports = router;