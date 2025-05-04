const mongoose  = require("mongoose");
const { BloodBank } = require("../../models/BloodBank");
const { BloodRequest } = require("../../models/BloodRequest");
const { Hospital } = require("../../models/Hospital");
const { errorResponse } = require("../../utils/errorResponse");

exports.createBloodRequest = async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const { bloodGroup , BloodBankId } = req.body;
        if(!bloodGroup || !BloodBankId) {
            errorResponse(res,400,"bloodGroup and BloodBankId are required");
        }

        const bloodBank = await BloodBank.findById(BloodBankId);
        if(!bloodBank){
            errorResponse(res,400,"cannot find bloodbank");
        }
        const hospital = await Hospital.findById(req.admin.workplaceId);
        if(!hospital){
            errorResponse(res,400,"cannot find hospital");
        }

        const bloodRequest = new BloodRequest({
            bloodGroup : bloodGroup,
            BloodBank : BloodBankId,
            Hospital : req.admin.workplaceId,
            status : "pending"
        })
        await bloodRequest.save({session});

        hospital.BloodRequest.push(bloodRequest._id);
        await hospital.save({session});

        bloodBank.BloodRequest.push(bloodRequest._id);
        await bloodBank.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success : true,
            message : "BloodRequest sent sucessfully",
            bloodRequest
        });
        
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        // console.error("Error Creating BloodRequest" , error);
        errorResponse(res,500,"Error Creating BloodRequest", error);
    }
}

exports.getBloodRequests = async (req,res) => {
    try{
        const admin = req.admin;
        let workplace;
        if (admin.workplaceType === "Hospital") {
            workplace = await Hospital.findById(admin.workplaceId)
                .populate({
                    path: 'BloodRequest',
                    populate: {
                        path: 'BloodBank',
                        select: 'name city'
                    }
                });
        } else if (admin.workplaceType === "BloodBank") {
            workplace = await BloodBank.findById(admin.workplaceId)
                .populate({
                    path: 'BloodRequest',
                    populate: {
                        path: 'Hospital',
                        select: 'name city'
                    }
                });
        }
        
        else{
            errorResponse(res,400,"workplaceType not valid");
        }
        if(!workplace){
            errorResponse(res,400,"workplace not found");
        }
        
        // let bloodRequests = await workplace.populate('BloodRequest', '');

        res.status(200).json({
            success : true,
            bloodRequests : workplace.BloodRequest
        })

    }
    catch(error){
        errorResponse(res,500,"Error fetching bloodrequests", error);
    }
}