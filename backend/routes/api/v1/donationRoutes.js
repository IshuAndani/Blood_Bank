const express = require('express');
const { 
  createDonation, 
  getDonorDonations, 
  getBloodBankDonations 
} = require('../../../controllers/donation/donationController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessWorkplace } = require('../../../middlewares/accessContol');

const router = express.Router();

// Create new donation
router.post(
  '/create',
  protect,
  checkRole(['headadmin', 'admin']),
  createDonation
);

// Get donation history for a donor
router.get(
  '/donor/:donorId',
  protect,
  checkRole(['headadmin', 'admin']),
  getDonorDonations
);

// Get donations for a blood bank
router.get(
  '/bloodbank',
  protect,
  checkRole(['headadmin', 'admin']),
  // canAccessWorkplace,
  getBloodBankDonations
);

module.exports = router;