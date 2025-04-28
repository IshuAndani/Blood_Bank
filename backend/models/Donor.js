const mongoose = require('mongoose');
const cleanString = require('../utils/cleanString');

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
            values : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message : '{VALUE} is not a valid blood group'
        }
    },
    city : {
        type : String,
        required : true,
        enum : {
            values : ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
            message : 'We are not operational in {VALUE} yet'  
        }
    },
    lastDonationDate: {
        type: Date,
        default: new Date('1970-01-01')
    },
    notifiedShortages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shortage'
        }
    ]
}, {timestamps: true});

donorSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
});
  

exports.Donor = mongoose.model('Donor', donorSchema);
