const {asyncHandler }= require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');
const donationService = require('../../services/donationService');

exports.createDonation = asyncHandler(async (req, res) =>
  sendResponse(res, 201, true, 'Donation recorded successfully',
    await donationService.createDonation({
      donorId: req.body.donorId,
      donatedAt: req.admin.workplaceId
    })
  )
);

exports.getDonorDonations = asyncHandler(async (req, res) =>
  sendResponse(res, 200, true, 'Donations fetched successfully',
    await donationService.getDonationsByDonor(req.params.donorId)
  )
);

exports.getBloodBankDonations = asyncHandler(async (req, res) =>
  sendResponse(res, 200, true, 'Blood bank donations fetched successfully',
    await donationService.getDonationsByBloodBank(req.admin.workplaceId)
  )
);
