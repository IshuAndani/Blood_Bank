const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../../config/auth");
const { errorResponse } = require("../../utils/errorResponse");
const { Donor } = require('../../models/Donor');

exports.isLoggedIn = async(req,res,next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            errorResponse(res,401,"Not authorized for this route");
        }

        const decoded = jwt.verify(token,jwtSecret);

        const donor = await Donor.findById(decoded.id);
        if(!donor){
            errorResponse(res,401, "User no longer exist");
        }

        req.donor = {id : donor._id};

        next();
    } catch (error) {
        errorResponse(res,500,"Error in donor isLoggedIn",error);
    }
}

exports.protectDonor = async(req,res,next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return next();
            // errorResponse(res,401,"Not authorized for this route");
        }

        const decoded = jwt.verify(token,jwtSecret);

        const donor = await Donor.findById(decoded.id);
        if(!donor){
            errorResponse(res,401, "User no longer exist");
        }

        req.donor = {id : donor._id, city : donor.city};

        next();
    } catch (error) {
        errorResponse(res,500,"Error in protectDonor",error);
    }
}