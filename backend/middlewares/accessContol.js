const { AppError } = require('../utils/error.handler'); // Custom error class

exports.canAccessBloodBank = async (req,res,next) => {
    if(req.admin.workplaceType === "BloodBank"){
        return next();
    }
    return next(new AppError('You dont have access to this workplace',403));
}

exports.canAccessHospital = async (req,res,next) => {
    if(req.admin.workplaceType === "Hospital"){
        return next();
    }
    return next(new AppError('You dont have access to this workplace',403));
}