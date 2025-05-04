const { Hospital } = require('../../models/Hospital');
const { errorResponse } = require('../../utils/errorResponse');

exports.createHospital = async (req, res) => {
    try{
        const { name, city } = req.body;

        if(!name || !city) {
            errorResponse(res,400,"Name and city are required");
            // return res.status(400).json({ message: "Name and city are required" });
        }

        const newHospital = new Hospital({
            name: name,
            city: city,
            employees: {
                headadmin: [],
                admin: []
            },
            BloodRequest: []
        });

        await newHospital.save()
            .then(hospital => {
                res.status(201).json({ message: "Hospital created successfully", hospital });
            }).catch(err => {
                errorResponse(res, 500, err.message);
                // res.status(500).json({ message: "Error creating hospital", error: err.message });
            });
    }catch(err) {
        console.error('Error creating hospital:', err);
        errorResponse(res, 500, err.message);
    }
};