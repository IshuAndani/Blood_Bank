const mongoose = require('mongoose');
exports.getWorkplaceIdFromRequest = (req) => {
    return req.params.workplaceId || req.body.workplace;
};
  
exports.toObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
};
  