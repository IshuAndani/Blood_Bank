const express = require('express');
const router = express.Router();

const bloodBankRoutes = require('./bloodBankRoutes');
const bloodRequestRoutes = require('./bloodRequestRoutes');
const donationRoutes = require('./donationRoutes');
const donorRoutes = require('./donorRoutes');
const hospitalRoutes = require('./hospitalRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/bloodbank', bloodBankRoutes);
router.use('/bloodrequest',bloodRequestRoutes);
router.use('/donation',donationRoutes);
router.use('/hospital',hospitalRoutes);
router.use('/inventory',inventoryRoutes);
router.use('/donor',donorRoutes);
router.use('/admin',adminRoutes);

module.exports = router;