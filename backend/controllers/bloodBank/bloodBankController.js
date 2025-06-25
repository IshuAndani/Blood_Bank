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

// @desc    Get all employees (admins and headadmins) for a blood bank
exports.getEmployees = asyncHandler(async (req, res) => {
  const { bloodBankId } = req.params;
  const bloodBank = await require('../../models/BloodBank').BloodBank.findById(bloodBankId)
    .populate('employees.headadmin', 'name email role')
    .populate('employees.admin', 'name email role');

  if (!bloodBank) {
    return sendResponse(res, 404, false, 'Blood bank not found');
  }

  const employees = [
    ...bloodBank.employees.headadmin.map(e => ({ ...e.toObject(), type: 'headadmin' })),
    ...bloodBank.employees.admin.map(e => ({ ...e.toObject(), type: 'admin' }))
  ];

  return sendResponse(res, 200, true, 'Employees fetched successfully', employees);
});

// @desc    Get all donations for a blood bank
exports.getDonations = asyncHandler(async (req, res) => {
  const { bloodBankId } = req.params;
  const Donation = require('../../models/Donation').Donation;
  const donations = await Donation.find({ donatedAt: bloodBankId })
    .sort({ createdAt: -1 })
    .populate('donor', 'name email bloodGroup');

  return sendResponse(res, 200, true, 'Donations fetched successfully', donations);
});
