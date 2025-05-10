const {asyncHandler} = require('../../utils/asyncHandler');
const { sendResponse } = require('../../utils/response.util');
const bloodRequestService = require('../../services/bloodRequestService');

exports.createBloodRequest = asyncHandler(async (req, res) => {
  const result = await bloodRequestService.createBloodRequest(req.body, req.admin);
  return sendResponse(res, 201, true, 'BloodRequest sent successfully', { bloodRequest: result });
});

exports.getBloodRequests = asyncHandler(async (req, res) => {
  const bloodRequests = await bloodRequestService.getBloodRequests(req.admin);
  return sendResponse(res, 200, true, 'BloodRequests fetched successfully', { bloodRequests });
});

exports.updateBloodRequestStatus = asyncHandler(async (req, res) => {
  const { bloodRequestId } = req.params;
  const { status, reason } = req.body;

  await bloodRequestService.updateBloodRequestStatus(bloodRequestId, status, reason, req.admin);
  return sendResponse(res, 200, true, `BloodRequest closed successfully with status: ${status}`);
});
