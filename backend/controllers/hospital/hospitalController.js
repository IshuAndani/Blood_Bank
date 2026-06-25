const {asyncHandler} = require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');
const hospitalService = require('../../services/hospitalService');

exports.createHospital = asyncHandler(async (req, res) => {
    const { name, city, coordinates } = req.body;
    const newHospital = await hospitalService.createHospital(name, city, coordinates);
    return sendResponse(res, 201, true, 'Hospital created successfully', { newHospital });
});

exports.getHospitals = asyncHandler(async (req,res) => {
  return sendResponse(res,200,true,'Hospitals Fetched', await hospitalService.getHospitals());
});
