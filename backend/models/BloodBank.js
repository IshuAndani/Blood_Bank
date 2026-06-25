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
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function (val) {
                    return val.length === 2 &&
                        val[0] >= -180 && val[0] <= 180 &&   // Longitude
                        val[1] >= -90 && val[1] <= 90;       // Latitude
                },
                message: 'Coordinates must be valid [longitude, latitude]'
            }
        }
    }
}, {timestamps: true});

bloodBankSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
});

// bloodBankSchema.index({ location: "2dsphere" }); // for geo-queries

exports.BloodBank = mongoose.model("BloodBank", bloodBankSchema);
