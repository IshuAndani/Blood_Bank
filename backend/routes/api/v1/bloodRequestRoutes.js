const express = require('express');
const { createBloodRequest , getBloodRequests } = require('../../../controllers/bloodRequest/bloodRequestController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessHospital } = require('../../../middlewares/accessContol');

const router = express.Router();

router.get('/', protect, checkRole(["headadmin","admin"]), getBloodRequests);

router.post('/create', protect, checkRole(["headadmin","admin"]), canAccessHospital, createBloodRequest);

module.exports = router;