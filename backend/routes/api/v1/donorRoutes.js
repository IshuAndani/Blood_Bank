// backend/routes/api/v1/donorRoutes.js
const express = require('express');
const { searchDonor, createDonorByAdmin } = require('../../../controllers/donor/donorController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessBloodBank } = require('../../../middlewares/accessContol');
const { registerDonor, loginDonor, getDonations , getBloodBanks, getDonors, chatBot} = require('../../../controllers/donor/donorController');
const { isLoggedIn,protectDonor } = require('../../../middlewares/auth/donorProtect');
const { limiter } = require('../../../utils/rateLimit');

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

router.get('/', protect, checkRole(['superadmin']), getDonors);

router.post('/chatbot', isLoggedIn, limiter(60*1000, 3), chatBot);

module.exports = router;