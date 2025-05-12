const express = require('express');
const { createHospital } = require('../../../controllers/hospital/hospitalController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');

const router = express.Router();

router.post('/create', protect, checkRole(["superadmin"]), createHospital);

module.exports = router;
