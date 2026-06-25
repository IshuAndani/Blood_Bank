const express = require('express');
const { createBloodBank, getBloodBanksByBloodGroup, getBloodBanks, getEmployees, getDonations } = require('../../../controllers/bloodBank/bloodBankController');
const { protect } = require('../../../middlewares/auth/protect');
const { checkRole } = require('../../../middlewares/auth/roleMiddleware');
const {canAccessHospital} = require('../../../middlewares/accessContol');

const router = express.Router();

// router.get('/', (req,res) => {
//   res.json({
//     sucess : true
//   })
// });

router.get(
  '/search', 
  protect, 
  checkRole(["headadmin","admin"]), 
  canAccessHospital, 
  getBloodBanksByBloodGroup
);

router.post(
  '/create',
  protect,
  checkRole(['superadmin']),
  createBloodBank
);

router.get('/', protect, checkRole(['superadmin']), getBloodBanks);

// Add route to get employees for a blood bank
router.get('/:bloodBankId/employees', getEmployees);

// Add route to get donations for a blood bank
router.get('/:bloodBankId/donations', getDonations);

module.exports = router;
