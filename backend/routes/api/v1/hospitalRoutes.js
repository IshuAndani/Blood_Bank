const express = require('express');
const { createHospital , getHospitals} = require('../../../controllers/hospital/hospitalController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');

const router = express.Router();

router.post('/create', protect, checkRole(["superadmin"]), createHospital);

router.get('/', protect, checkRole(['superadmin']), getHospitals);

module.exports = router;
