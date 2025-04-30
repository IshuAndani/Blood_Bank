const express = require('express');
const { createBloodBank } = require('../../../controllers/bloodBank/bloodBankController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');

const router = express.Router();

router.post(
  '/create',
  protect,
  checkRole(['superadmin']),
  createBloodBank
);

module.exports = router;
