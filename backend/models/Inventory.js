const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    bloodBank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank',
        required: true
    },
    bloodGroups: {
        "A+": { type: Number, default: 0, min: 0 },
        "A-": { type: Number, default: 0, min: 0 },
        "B+": { type: Number, default: 0, min: 0 },
        "B-": { type: Number, default: 0, min: 0 },
        "AB+": { type: Number, default: 0, min: 0 },
        "AB-": { type: Number, default: 0, min: 0 },
        "O+": { type: Number, default: 0, min: 0 },
        "O-": { type: Number, default: 0, min: 0 }
    }
}, { timestamps: true });

exports.Inventory = mongoose.model("Inventory", inventorySchema);