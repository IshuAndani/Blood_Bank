const mongoose = require('mongoose');
const moment = require('moment'); // For date manipulation
const { cleanString } = require('../utils/cleanString');
const { hashedPassword } = require('../utils/passwordUtils');
const { ALLOWED_CITIES } = require('../../shared/constants/cities'); 
const { minAgeForDonor , maxAgeForDonor} = require('../config/constants');
const {BLOOD_GROUPS} = require('../../shared/constants/bloodGroups');


const donorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String, 
        required : true,
        unique : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password : {
        type : String,
        required : true
    },
    bloodGroup : {
        type : String,
        required : true,
        enum : {
            values : BLOOD_GROUPS,
            message : '{VALUE} is not a valid blood group'
        }
    },
    city : {
        type : String,
        required : true,
        enum : {
            values : ALLOWED_CITIES,
            message : 'We are not operational in {VALUE} yet'  
        }
    },
    dob: { 
        type: Date, 
        required: true, 
        validate: {
          validator: function(dob) { 
            const age = moment().diff(moment(dob), 'years'); // Calculate age
            return age >= minAgeForDonor && agr <= maxAgeForDonor; // Validator to check if age is >= 18
          },
          message: 'Donor must be at least 18 years old.'
        }
    },
    donations : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Donation'
        }
    ],
    lastDonationDate: {
        type: Date,
        default: null
    },
    // notifiedShortages: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Shortage'
    //     }
    // ]
}, {timestamps: true});

donorSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    if (this.email){
        this.email = cleanString(this.email);
    }
    next();
});

donorSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashedPassword(this.password);
    }
    next();
});
  

exports.Donor = mongoose.model('Donor', donorSchema);
