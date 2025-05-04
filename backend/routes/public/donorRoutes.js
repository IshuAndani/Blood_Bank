const express = require('express');
const { registerDonor, loginDonor, getDonations , getBloodBanks} = require('../../controllers/donor/donorController');
const { isLoggedIn,protectDonor } = require('../../middlewares/auth/donorProtect');
const router = express.Router();

// Public route for donor self-registration
router.post('/register', registerDonor);

router.post('/login', loginDonor);

router.get('/donations', isLoggedIn, getDonations);

router.get('/bloodbanks', protectDonor, getBloodBanks);

module.exports = router;