const { Shortage } = require("../models/Shortage");
const { BloodBank } = require("../models/BloodBank");
const { Donor } = require("../models/Donor");
const { transporter } = require("../utils/nodemailer");
const { donorEligibleTime } = require("../config/constants");
const { AppError } = require("../utils/error.handler");

exports.checkAndNotifyShortages = async () => {
  try {
    const shortages = await Shortage.find({ resolved: false });

    let shortagesChecked = 0;
    let donorsNotified = 0;

    for (const shortage of shortages) {
      shortagesChecked++;

      const bloodbank = await BloodBank.findById(shortage.bloodBank);
      if (!bloodbank) throw new AppError("Blood bank not found", 404);

      const eligibleDonors = await Donor.find({
        city: bloodbank.city,
        bloodGroup: shortage.bloodGroup,
        $or: [
          { lastDonationDate: { $lte: new Date(Date.now() - donorEligibleTime) } },
          { lastDonationDate: { $exists: false } },
          { lastDonationDate: null }
        ]
      });

      for (const donor of eligibleDonors) {
        if (shortage.donorsNotified.includes(donor._id)) continue;

        await transporter.sendMail({
          from: `BloodBank App <${process.env.EMAIL_USER}>`,
          to: donor.email,
          subject: `Shortage in BloodBank`,
          text: `We need your precious blood donation. Please visit ${bloodbank.name} in your city ${donor.city} and help save a life.`
        });

        shortage.donorsNotified.push(donor._id);
        donorsNotified++;
      }

      await shortage.save();
    }

    return { shortagesChecked, donorsNotified };
  } catch (err) {
    if (err instanceof AppError) throw err;
    // console.error("Failed to check and notify shortages : ",err);
    throw new AppError("Failed to check and notify shortages", 500,err);
  }
};

exports.createShortage = async (bloodBankId, bloodGroup) => {
  try {
    const existingShortage = await Shortage.findOne({
      bloodBank: bloodBankId,
      bloodGroup,
      resolved: false
    });

    if (existingShortage) return;

    const shortage = new Shortage({
      bloodBank: bloodBankId,
      bloodGroup
    });

    await shortage.save();
    return shortage;
  } catch (error) {
    // console.error('Error creating shortage:', error);
    throw new AppError('Failed to create shortage', 500,error);
  }
};

