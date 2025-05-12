const mongoose = require("mongoose");
const { cleanString } = require('../utils/cleanString');
const { ALLOWED_CITIES } = require('../../shared/constants/cities');

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
            values : ALLOWED_CITIES,
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
        // observer: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Admin'
        // }]
    },
    // BloodRequest: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'BloodRequest'
    //     }
    // ]
}, {timestamps: true});

bloodBankSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
});

// bloodBankSchema.index({ location: "2dsphere" }); // for geo-queries

exports.BloodBank = mongoose.model("BloodBank", bloodBankSchema);
