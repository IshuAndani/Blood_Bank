const mongoose = require('mongoose');
const {cleanString } = require('../utils/cleanString');
const { ALLOWED_CITIES } = require('../../shared/constants/cities'); 


const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city : {
        type : String,
        required : true,
        enum : {
            values : ALLOWED_CITIES,
            message : 'We are not operational in {VALUE} yet'  
        }
    },
    employees: {
        headadmin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }],
        admin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }]
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

hospitalSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
}, {timestamps: true});

hospitalSchema.index({ location: '2dsphere' }); // for geo-queries

exports.Hospital = mongoose.model('Hospital', hospitalSchema);
