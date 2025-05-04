// backend/routes/api/v1/donorRoutes.js
const express = require('express');
const { searchDonor, createDonorByAdmin } = require('../../../controllers/donor/donorController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessBloodBank } = require('../../../middlewares/accessContol');

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

module.exports = router;