// backend/controllers/inventory/inventoryController.js
const inventoryService = require('../../services/inventoryService');
const { errorResponse } = require('../../utils/errorResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

// Get inventory for a blood bank
exports.getInventory = asyncHandler(async (req, res) => {
  try {
    const bloodBankId = req.admin.workplace; // From auth middleware
    
    const inventory = await inventoryService.getInventory(bloodBankId);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this blood bank'
      });
    }
    
    res.status(200).json({
      success: true,
      inventory: {
        id: inventory._id,
        bloodBank: inventory.bloodBank,
        bloodGroups: inventory.bloodGroups
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Error fetching inventory', error.message);
  }
});