const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Donor', 
        required: true 
    },
    bloodGroup: { 
        type: String, 
        required: true,
        enum : {
            values : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message : '{VALUE} is not a valid blood group'
        }
    },
    quantity: { 
        type: Number, //units
        required: true 
    }, 
    donatedAt: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank'
    },
}, {timestamps: true});

exports.Donation = mongoose.model('Donation', donationSchema);
