const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('../../shared/constants/bloodGroups');

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
            values : BLOOD_GROUPS,
            message : '{VALUE} is not a valid blood group'
        }
    },
    // quantity: { 
    //     type: Number, //units
    //     required: true 
    // }, 
    donatedAt: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank'
    },
    status : {
        type : String,
        enum : {
            values : ["stored","expired","used"],
            message : "Invalid status type"
        },
        default : "stored"
    }
}, {timestamps: true});

exports.Donation = mongoose.model('Donation', donationSchema);
