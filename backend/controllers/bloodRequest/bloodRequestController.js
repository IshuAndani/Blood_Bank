const mongoose  = require("mongoose");
const { BloodBank } = require("../../models/BloodBank");
const { BloodRequest } = require("../../models/BloodRequest");
const { Inventory } = require('../../models/Inventory');
const { Hospital } = require("../../models/Hospital");
const { errorResponse } = require("../../utils/errorResponse");
const { Donation } = require("../../models/Donation");
const { threshold } = require('../../../shared/constants/threshold');
const { createShortage } = require('../../utils/createShortage');

exports.createBloodRequest = async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const { bloodGroup , BloodBankId } = req.body;
        if(!bloodGroup || !BloodBankId) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res,400,"bloodGroup and BloodBankId are required");
        }

        const bloodBank = await BloodBank.findById(BloodBankId);
        if(!bloodBank){
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res,400,"cannot find bloodbank");
        }
        const hospital = await Hospital.findById(req.admin.workplaceId);
        if(!hospital){
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res,400,"cannot find hospital");
        }

        const bloodRequest = new BloodRequest({
            bloodGroup : bloodGroup,
            BloodBank : BloodBankId,
            Hospital : req.admin.workplaceId,
            status : "pending"
        })
        await bloodRequest.save({session});

        // hospital.BloodRequest.push(bloodRequest._id);
        // await hospital.save({session});

        // bloodBank.BloodRequest.push(bloodRequest._id);
        // await bloodBank.save({session});

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
        return errorResponse(res,500,"Error Creating BloodRequest", error);
    }
}

exports.getBloodRequests = async (req,res) => {
    try{
        const admin = req.admin;
        let bloodrequests;
        if(admin.workplaceType === "Hospital"){
            bloodrequests = BloodRequest.find({Hospital : admin.workplaceId}).populate('BloodBank');
        }
        else if(admin.workplaceType === "BloodBank"){
            bloodrequests = BloodRequest.find({BloodBank : admin.workplaceId}).populate('Hospital');
        }
        // let workplace;
        // if (admin.workplaceType === "Hospital") {
        //     workplace = await Hospital.findById(admin.workplaceId)
        //         .populate({
        //             path: 'BloodRequest',
        //             populate: {
        //                 path: 'BloodBank',
        //                 select: 'name city'
        //             }
        //         });
        // } else if (admin.workplaceType === "BloodBank") {
        //     workplace = await BloodBank.findById(admin.workplaceId)
        //         .populate({
        //             path: 'BloodRequest',
        //             populate: {
        //                 path: 'Hospital',
        //                 select: 'name city'
        //             }
        //         });
        // }
        
        else{
            return errorResponse(res,400,"workplaceType not valid");
        }
        // if(!workplace){
        //     errorResponse(res,400,"workplace not found");
        // }
        
        // let bloodRequests = await workplace.populate('BloodRequest', '');

        res.status(200).json({
            success : true,
            bloodrequests 
        });
    }
    catch(error){
        return errorResponse(res,500,"Error fetching bloodrequests", error);
    }
}

exports.updateBloodRequestStatus = async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { bloodRequestId } = req.params;
        const {status,reason} = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, "Invalid status value");
        }
      
        const bloodRequest = await BloodRequest.findById(bloodRequestId);
        if (!bloodRequest) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 404, "Blood request not found");
        }
        
        if (bloodRequest.BloodBank.toString() !== req.admin.workplaceId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 403, "Not authorized to update this request");
        }

        if(bloodRequest.status !== "pending"){
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res,404,"BloodRequest already settled");
        }

        bloodRequest.status = status;
        if(status === "rejected" && reason) bloodRequest.rejectReason = reason;

        if(status === "approved"){
            const bloodbank = await BloodBank.findById(req.admin.workplaceId);
            const inventory = await Inventory.findOne({bloodBank : req.admin.workplaceId});
            if(!inventory){
                await session.abortTransaction();
                session.endSession();
                return errorResponse(res,404,"inventory not found ");
            }
            if(inventory.bloodGroups[bloodRequest.bloodGroup] <= 0) {
                await session.abortTransaction();
                session.endSession();
                return errorResponse(res,400,"Insufficient blood in inventory");
            } 
            inventory.bloodGroups[bloodRequest.bloodGroup] -= 1;

              if(inventory.bloodGroups[bloodRequest.bloodGroup] <= threshold){
                createShortage(bloodRequest.BloodBank, bloodRequest.bloodGroup);
              }
            
            const usedDonation = await Donation.findOne({status : "stored", donatedAt : req.admin.workplaceId}).sort({createdAt : 1}).session(session);
            if(usedDonation){
                usedDonation.status = "used";
            }
            await usedDonation.save({session});
            await inventory.save({session})
        }
        await bloodRequest.save({session});

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success : true,
            message : `BloodRequest closed successfully with status : ${status}`
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res,500,"error updating bloodreq", error);
    }
}