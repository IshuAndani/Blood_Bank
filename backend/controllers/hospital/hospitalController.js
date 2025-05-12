const {asyncHandler} = require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');
const hospitalService = require('../../services/hospitalService');

exports.createHospital = asyncHandler(async (req, res) => {
    const { name, city } = req.body;
    const newHospital = await hospitalService.createHospital(name, city);
    return sendResponse(res, 201, true, 'Hospital created successfully', { newHospital });
});
