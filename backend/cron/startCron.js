const {checkExpiredDonations} = require('../controllers/donation/donationController');
const {checkShortages} = require('../controllers/shortage/shortageController');
const cron = require('node-cron');
const { cronTime } = require('../config/constants');

exports.startCron = () => {
  cron.schedule(cronTime, async () => {
    console.log('[CRON] Checking for expired donations...');
    await checkExpiredDonations();
    console.log('[CRON] Checking for shortages...');
    await checkShortages();
    console.log('[CRON] job done');
  });
};
