const { BLOOD_GROUP_MAP } = require('../../../shared/constants/bloodGroups');
const {asyncHandler} = require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');
const { AppError } = require('../../utils/error.handler');
const bloodBankService = require('../../services/bloodBankService');

// @desc    Create a new blood bank
exports.createBloodBank = asyncHandler(async (req, res) => {
  const { name, city, coordinates } = req.body;
  const createdById = req.admin.id;

  const { bloodBank, inventory } = await bloodBankService.createBloodBank(name, city, coordinates);

  return sendResponse(res, 201, true, 'Blood Bank created successfully', {
    bloodBank,
    inventory: {
      id: inventory._id,
      bloodGroups: inventory.bloodGroups
    }
  });
});

// @desc    Get blood banks with available units of a specific blood group
exports.getBloodBanksByBloodGroup = asyncHandler(async (req, res) => {
  // console.log(req.query);
  const friendlyName = req.query.bloodGroup;
  const actualKey = BLOOD_GROUP_MAP[friendlyName];

  const result = await bloodBankService.getBloodBanksByBloodGroup(actualKey);

  return sendResponse(res, 200, true, 'Matching blood banks found', result);
});

exports.getBloodBanks = asyncHandler(async (req,res) => {
  return sendResponse(res,200,true,'BloodBanks Fetched', await bloodBankService.getBloodBanks());
});
