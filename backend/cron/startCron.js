const {checkExpiredDonations} = require('../services/donationService');
const {checkAndNotifyShortages} = require('../services/shortageService');
const cron = require('node-cron');
const { cronTime } = require('../config/constants');

exports.startCron = () => {
  cron.schedule(cronTime, async () => {
    console.log('[CRON] Checking for expired donations...');
    const expiredDonations = await checkExpiredDonations();
    console.log(`${expiredDonations.length} blood units marked as expired.`);

    console.log('[CRON] Checking for shortages...');
    const { shortagesChecked, donorsNotified } = await checkAndNotifyShortages();
    console.log(`${shortagesChecked} shortages checked and ${donorsNotified} donor notified`);
    console.log('[CRON] job done');
  });
};
