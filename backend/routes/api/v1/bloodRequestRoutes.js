const express = require('express');
const { createBloodRequest , getBloodRequests, updateBloodRequestStatus } = require('../../../controllers/bloodRequest/bloodRequestController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const { canAccessHospital, canAccessBloodBank } = require('../../../middlewares/accessContol');

const router = express.Router();

router.get('/', protect, checkRole(["headadmin","admin"]), getBloodRequests);

router.post('/create', protect, checkRole(["headadmin","admin"]), canAccessHospital, createBloodRequest);

router.patch('/:bloodRequestId/status', protect, checkRole(["headadmin","admin"]), canAccessBloodBank, updateBloodRequestStatus)

module.exports = router;