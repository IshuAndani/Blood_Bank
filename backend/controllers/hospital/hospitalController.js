const { Hospital } = require('../../models/Hospital');
const { errorResponse } = require('../../utils/errorResponse');

exports.createHospital = async (req, res) => {
    try{
        const { name, city } = req.body;

        if(!name || !city) {
            errorResponse(res,400,"Name and city are required");
            // return res.status(400).json({ message: "Name and city are required" });
        }

        const existingHospital = await Hospital.findOne({name:name});
        if(existingHospital) {
            return errorResponse(res,400,"Hospital of this name already exist, pick different name");
        }

        const newHospital = new Hospital({
            name: name,
            city: city,
            employees: {
                headadmin: [],
                admin: []
            },
            // BloodRequest: []
        });

        await newHospital.save()
        
        res.status(201).json({
            success : true, 
            message: "Hospital created successfully", 
            newHospital
        });
    }catch(err) {
        console.error('Error creating hospital:', err);
        errorResponse(res, 500, err.message);
    }
};