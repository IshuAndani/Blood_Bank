const express = require('express');
const { 
  createDonation, 
  getDonorDonations, 
  getBloodBankDonations 
} = require('../../../controllers/donation/donationController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessBloodBank } = require('../../../middlewares/accessContol');

const router = express.Router();

// Create new donation
router.post(
  '/create',
  protect,
  checkRole(['headadmin', 'admin']),
  canAccessBloodBank,
  createDonation
);

// Get donation history for a donor
// router.get(
//   '/donor/:donorId',
//   protect,
//   checkRole(['headadmin', 'admin']),
//   canAccessBloodBank,
//   getDonorDonations
// );

// Get donations for a blood bank
router.get(
  '/',
  protect,
  checkRole(['headadmin', 'admin']),
  canAccessBloodBank,
  // canAccessWorkplace,
  getBloodBankDonations
);

module.exports = router;