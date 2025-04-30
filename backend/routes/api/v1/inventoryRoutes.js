// backend/routes/api/v1/inventoryRoutes.js
const express = require('express');
const { getInventory } = require('../../../controllers/inventory/inventoryController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessWorkplace } = require('../../../middlewares/accessContol');

const router = express.Router();

// Get inventory for a blood bank
router.get(
  '/',
  protect,
  checkRole(['superadmin', 'headadmin', 'admin', 'observer']),
  // canAccessWorkplace,
  getInventory
);

module.exports = router;