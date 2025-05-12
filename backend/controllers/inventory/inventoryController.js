// backend/controllers/inventory/inventoryController.js
const inventoryService = require('../../services/inventoryService');
const { sendResponse } = require('../../utils/response.util');
const { asyncHandler } = require('../../utils/asyncHandler');

// Get inventory for a blood bank
exports.getInventory = asyncHandler(async (req, res) => {
  const bloodBankId = req.admin.workplaceId; // From auth middleware
  const inventory = await inventoryService.getInventory(bloodBankId);

  sendResponse(res, 200, true, 'Inventory fetched successfully', {
    id: inventory._id,
    bloodBank: inventory.bloodBank,
    bloodGroups: inventory.bloodGroups
  });
});
