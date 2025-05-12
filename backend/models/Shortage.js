const mongoose = require('mongoose');
const {BLOOD_GROUPS} = require('../../shared/constants/bloodGroups');


const shortageSchema = new mongoose.Schema({
    bloodBank: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BloodBank', 
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
    donorsNotified: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Donor' 
        }
    ],
    resolved: { 
        type: Boolean, 
        default: false 
    },
}, {timestamps: true});

exports.Shortage = mongoose.model('Shortage', shortageSchema);
