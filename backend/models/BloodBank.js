const mongoose = require("mongoose");
const { cleanString } = require('../utils/cleanString');

const bloodBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique : true
    },
    city : {
        type : String,
        required : true,
        enum : {
            values : ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
            message : 'We are not operational in {VALUE} yet'  
        }
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory'
    },
    employees: {
        headadmin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }],
        admin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }],
        observer: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }]
      },
}, {timestamps: true});

bloodBankSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
});

// bloodBankSchema.index({ location: "2dsphere" }); // for geo-queries

exports.BloodBank = mongoose.model("BloodBank", bloodBankSchema);
