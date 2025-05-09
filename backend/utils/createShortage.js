const {Shortage} = require('../models/Shortage');
const { errorResponse } = require('./errorResponse');

exports.createShortage = async (bloodbankId,bloodGroup) => {
    try {
        const existingShortage = await Shortage.findOne({
            bloodBank : bloodbankId,
            bloodGroup : bloodGroup,
            resolved : false
        })
        if(existingShortage) return;
        const shortage = new Shortage({
            bloodBank : bloodbankId,
            bloodGroup : bloodGroup
        });
        await shortage.save();
    } catch (error) {
        errorResponse(res,500,"error creating shortage",error);
    }
}