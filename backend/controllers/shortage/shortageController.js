const { Shortage } = require("../../models/Shortage")
const { BloodBank } = require("../../models/BloodBank");
const { Donor } = require("../../models/Donor");
const { transporter } = require("../../utils/nodemailer");
const { donorEligibleTime } = require("../../config/constants");

exports.checkShortages = async() => {
    try{
        const shortages = await Shortage.find({
            resolved : false
        });
        console.log("shortages : ", shortages)
        let shortageCnt = 0;
        let donorCnt = 0;
        for(const shortage of shortages){
            shortageCnt++;
            const bloodbankId = shortage.bloodBank;
            const bloodGroup = shortage.bloodGroup;

            const bloodbank = await BloodBank.findById(bloodbankId);
            const eligibleDonors = await Donor.find({
                city : bloodbank.city,
                // lastDonationDate : {$lte : new Date(Date.now() - donorEligibleTime)},
                bloodGroup : bloodGroup,
                $or: [
                    { lastDonationDate: { $lte: new Date(Date.now() - donorEligibleTime) } },
                    { lastDonationDate: { $exists: false } },
                    { lastDonationDate: null }
                  ]
                  
            });
            console.log("donors : ",eligibleDonors);
            for(const donor of eligibleDonors){
                if(shortage.donorsNotified.includes(donor._id)) continue;
                donorCnt++;
                await transporter.sendMail({
                    from : `BloodBank App <${process.env.EMAIL_USER}>`,
                    to : donor.email,
                    subject:`Shortage in BloodBank`,
                    text : `We need your precious blood donation. Please visit ${bloodbank.name} in your city ${donor.city} and help saving a life.`
                })
                console.log("notified donor : ", donor);
                shortage.donorsNotified.push(donor._id);
            }
            await shortage.save();
        }
        console.log(`${donorCnt} donors notified for ${shortageCnt} shortages`);
    }catch(error){
        console.error("error while checking shortages : ", error);
    }
}