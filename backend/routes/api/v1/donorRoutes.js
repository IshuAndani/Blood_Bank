// backend/routes/api/v1/donorRoutes.js
const express = require('express');
const { searchDonor, createDonorByAdmin } = require('../../../controllers/donor/donorController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessBloodBank } = require('../../../middlewares/accessContol');
const { registerDonor, loginDonor, getDonations , getBloodBanks} = require('../../../controllers/donor/donorController');
const { isLoggedIn,protectDonor } = require('../../../middlewares/auth/donorProtect');

const router = express.Router();

// Search donor by email
router.get(
  '/search',
  protect,
  checkRole(['headadmin', 'admin']),
  canAccessBloodBank,
  searchDonor
);

// Create donor by admin
router.post(
  '/create',
  protect,
  checkRole(['headadmin', 'admin']),
  canAccessBloodBank,
  createDonorByAdmin
);

router.post('/register', registerDonor);

router.post('/login', loginDonor);

router.get('/donations', isLoggedIn, getDonations);

router.get('/bloodbanks', protectDonor, getBloodBanks);

module.exports = router;