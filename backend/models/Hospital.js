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
    // BloodRequest: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'BloodRequest'
    //     }
    // ]
}, {timestamps: true});

hospitalSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
}, {timestamps: true});

hospitalSchema.index({ location: '2dsphere' }); // for geo-queries

exports.Hospital = mongoose.model('Hospital', hospitalSchema);
